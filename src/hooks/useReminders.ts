import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'bibleReminder';

interface ReminderSettings {
    enabled: boolean;
    time: string; // "HH:MM" 24-hour format
}

const DEFAULT_SETTINGS: ReminderSettings = {
    enabled: false,
    time: '08:00',
};

function loadSettings(): ReminderSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        // ignore
    }
    return DEFAULT_SETTINGS;
}

function saveSettings(settings: ReminderSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Returns milliseconds until the next occurrence of HH:MM today or tomorrow */
function msUntilNext(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) {
        // Already passed today — schedule for tomorrow
        target.setDate(target.getDate() + 1);
    }
    return target.getTime() - now.getTime();
}

function fireNotification() {
    if (Notification.permission !== 'granted') return;
    const n = new Notification('📖 Time to Read Your Bible!', {
        body: "Don't break your streak — open the app and log today's reading.",
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'bible-reminder', // replaces any existing reminder notification
        requireInteraction: false,
    });
    // Click opens the app
    n.onclick = () => {
        window.focus();
        n.close();
    };
}

export function useReminders() {
    const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    );
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSupported = typeof Notification !== 'undefined';

    /** Schedule (or re-schedule) the daily reminder */
    const scheduleReminder = useCallback((time: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const schedule = () => {
            const delay = msUntilNext(time);
            timerRef.current = setTimeout(() => {
                fireNotification();
                // Re-schedule for the next day
                schedule();
            }, delay);
        };

        schedule();
    }, []);

    /** Cancel any pending reminder */
    const cancelReminder = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // On mount: if reminders are enabled and permission is granted, start scheduling
    useEffect(() => {
        if (settings.enabled && permission === 'granted') {
            scheduleReminder(settings.time);
        }
        return () => cancelReminder();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /** Request notification permission and enable reminders */
    const enableReminders = useCallback(
        async (time: string): Promise<boolean> => {
            if (!isSupported) return false;

            let perm = Notification.permission;
            if (perm === 'default') {
                perm = await Notification.requestPermission();
                setPermission(perm);
            }

            if (perm !== 'granted') {
                setPermission(perm);
                return false;
            }

            const newSettings: ReminderSettings = { enabled: true, time };
            saveSettings(newSettings);
            setSettings(newSettings);
            scheduleReminder(time);
            return true;
        },
        [isSupported, scheduleReminder]
    );

    /** Disable reminders */
    const disableReminders = useCallback(() => {
        const newSettings: ReminderSettings = { ...settings, enabled: false };
        saveSettings(newSettings);
        setSettings(newSettings);
        cancelReminder();
    }, [settings, cancelReminder]);

    /** Update the reminder time (only if already enabled) */
    const updateTime = useCallback(
        (time: string) => {
            const newSettings: ReminderSettings = { ...settings, time };
            saveSettings(newSettings);
            setSettings(newSettings);
            if (newSettings.enabled && permission === 'granted') {
                scheduleReminder(time);
            }
        },
        [settings, permission, scheduleReminder]
    );

    /** Fire a test notification immediately */
    const sendTestNotification = useCallback(() => {
        fireNotification();
    }, []);

    return {
        isSupported,
        permission,
        enabled: settings.enabled,
        time: settings.time,
        enableReminders,
        disableReminders,
        updateTime,
        sendTestNotification,
    };
}

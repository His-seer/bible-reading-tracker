/**
 * 90-Day Bible Reading Plan
 * Day 1 = January 1, 2026
 * Each entry includes the passage text and a Bible.com link for easy reading.
 */

export interface ReadingPlanEntry {
    day: number;
    chapters: string;
    /** ISO date string for the scheduled date (YYYY-MM-DD) */
    scheduledDate: string;
    /** Bible.com URL to read the passage */
    bibleUrl: string;
}

/** Returns the scheduled date for a given day number (Day 1 = Jan 1, 2026) */
export function getScheduledDate(day: number): Date {
    const start = new Date(2026, 0, 1); // Jan 1, 2026
    start.setDate(start.getDate() + (day - 1));
    return start;
}

/** Returns the scheduled date as an ISO string (YYYY-MM-DD) */
export function getScheduledDateStr(day: number): string {
    return getScheduledDate(day).toISOString().split('T')[0];
}

const PLAN: Omit<ReadingPlanEntry, 'scheduledDate'>[] = [
    { day: 1, chapters: 'Romans 1-8', bibleUrl: 'https://www.bible.com/bible/111/ROM.1.NIV' },
    { day: 2, chapters: 'Romans 9-16', bibleUrl: 'https://www.bible.com/bible/111/ROM.9.NIV' },
    { day: 3, chapters: 'Hebrews 1-6', bibleUrl: 'https://www.bible.com/bible/111/HEB.1.NIV' },
    { day: 4, chapters: 'Hebrews 7-13', bibleUrl: 'https://www.bible.com/bible/111/HEB.7.NIV' },
    { day: 5, chapters: 'James & 1 John', bibleUrl: 'https://www.bible.com/bible/111/JAS.1.NIV' },
    { day: 6, chapters: '1 Peter, 2 Peter, 2 John, 3 John', bibleUrl: 'https://www.bible.com/bible/111/1PE.1.NIV' },
    { day: 7, chapters: 'John 1-10', bibleUrl: 'https://www.bible.com/bible/111/JHN.1.NIV' },
    { day: 8, chapters: 'John 11-21', bibleUrl: 'https://www.bible.com/bible/111/JHN.11.NIV' },
    { day: 9, chapters: 'Mark 1-8', bibleUrl: 'https://www.bible.com/bible/111/MRK.1.NIV' },
    { day: 10, chapters: 'Mark 9-16', bibleUrl: 'https://www.bible.com/bible/111/MRK.9.NIV' },
    { day: 11, chapters: 'Matthew 1-10', bibleUrl: 'https://www.bible.com/bible/111/MAT.1.NIV' },
    { day: 12, chapters: 'Matthew 11-20', bibleUrl: 'https://www.bible.com/bible/111/MAT.11.NIV' },
    { day: 13, chapters: 'Matthew 21-28', bibleUrl: 'https://www.bible.com/bible/111/MAT.21.NIV' },
    { day: 14, chapters: 'Luke 1-12', bibleUrl: 'https://www.bible.com/bible/111/LUK.1.NIV' },
    { day: 15, chapters: 'Luke 13-24', bibleUrl: 'https://www.bible.com/bible/111/LUK.13.NIV' },
    { day: 16, chapters: 'Acts 1-10', bibleUrl: 'https://www.bible.com/bible/111/ACT.1.NIV' },
    { day: 17, chapters: 'Acts 11-20', bibleUrl: 'https://www.bible.com/bible/111/ACT.11.NIV' },
    { day: 18, chapters: 'Acts 21-28', bibleUrl: 'https://www.bible.com/bible/111/ACT.21.NIV' },
    { day: 19, chapters: 'Revelation 1-10', bibleUrl: 'https://www.bible.com/bible/111/REV.1.NIV' },
    { day: 20, chapters: 'Revelation 11-22', bibleUrl: 'https://www.bible.com/bible/111/REV.11.NIV' },
    { day: 21, chapters: 'Daniel', bibleUrl: 'https://www.bible.com/bible/111/DAN.1.NIV' },
    { day: 22, chapters: 'Genesis 1-15', bibleUrl: 'https://www.bible.com/bible/111/GEN.1.NIV' },
    { day: 23, chapters: 'Genesis 16-33', bibleUrl: 'https://www.bible.com/bible/111/GEN.16.NIV' },
    { day: 24, chapters: 'Genesis 34-50', bibleUrl: 'https://www.bible.com/bible/111/GEN.34.NIV' },
    { day: 25, chapters: 'Exodus 1-15', bibleUrl: 'https://www.bible.com/bible/111/EXO.1.NIV' },
    { day: 26, chapters: 'Romans 1-8', bibleUrl: 'https://www.bible.com/bible/111/ROM.1.NIV' },
    { day: 27, chapters: 'Romans 9-16', bibleUrl: 'https://www.bible.com/bible/111/ROM.9.NIV' },
    { day: 28, chapters: 'Hebrews 1-6', bibleUrl: 'https://www.bible.com/bible/111/HEB.1.NIV' },
    { day: 29, chapters: 'Hebrews 7-13', bibleUrl: 'https://www.bible.com/bible/111/HEB.7.NIV' },
    { day: 30, chapters: 'James & 1 John', bibleUrl: 'https://www.bible.com/bible/111/JAS.1.NIV' },
    { day: 31, chapters: '1 Peter, 2 Peter, 2 John, 3 John', bibleUrl: 'https://www.bible.com/bible/111/1PE.1.NIV' },
    { day: 32, chapters: 'John 1-10', bibleUrl: 'https://www.bible.com/bible/111/JHN.1.NIV' },
    { day: 33, chapters: 'John 11-21', bibleUrl: 'https://www.bible.com/bible/111/JHN.11.NIV' },
    { day: 34, chapters: 'Mark 1-8', bibleUrl: 'https://www.bible.com/bible/111/MRK.1.NIV' },
    { day: 35, chapters: 'Mark 9-16', bibleUrl: 'https://www.bible.com/bible/111/MRK.9.NIV' },
    { day: 36, chapters: 'Matthew 1-10', bibleUrl: 'https://www.bible.com/bible/111/MAT.1.NIV' },
    { day: 37, chapters: 'Matthew 11-20', bibleUrl: 'https://www.bible.com/bible/111/MAT.11.NIV' },
    { day: 38, chapters: 'Matthew 21-28', bibleUrl: 'https://www.bible.com/bible/111/MAT.21.NIV' },
    { day: 39, chapters: 'Luke 1-12', bibleUrl: 'https://www.bible.com/bible/111/LUK.1.NIV' },
    { day: 40, chapters: 'Luke 13-24', bibleUrl: 'https://www.bible.com/bible/111/LUK.13.NIV' },
    { day: 41, chapters: 'Acts 1-10', bibleUrl: 'https://www.bible.com/bible/111/ACT.1.NIV' },
    { day: 42, chapters: 'Acts 11-20', bibleUrl: 'https://www.bible.com/bible/111/ACT.11.NIV' },
    { day: 43, chapters: 'Acts 21-28', bibleUrl: 'https://www.bible.com/bible/111/ACT.21.NIV' },
    { day: 44, chapters: 'Revelation 1-10', bibleUrl: 'https://www.bible.com/bible/111/REV.1.NIV' },
    { day: 45, chapters: 'Revelation 11-22', bibleUrl: 'https://www.bible.com/bible/111/REV.11.NIV' },
    { day: 46, chapters: 'Daniel', bibleUrl: 'https://www.bible.com/bible/111/DAN.1.NIV' },
    { day: 47, chapters: 'Genesis 1-15', bibleUrl: 'https://www.bible.com/bible/111/GEN.1.NIV' },
    { day: 48, chapters: 'Genesis 16-33', bibleUrl: 'https://www.bible.com/bible/111/GEN.16.NIV' },
    { day: 49, chapters: 'Genesis 34-50', bibleUrl: 'https://www.bible.com/bible/111/GEN.34.NIV' },
    { day: 50, chapters: 'Exodus 1-15', bibleUrl: 'https://www.bible.com/bible/111/EXO.1.NIV' },
    { day: 51, chapters: 'Exodus 16-30', bibleUrl: 'https://www.bible.com/bible/111/EXO.16.NIV' },
    { day: 52, chapters: 'Exodus 31-40', bibleUrl: 'https://www.bible.com/bible/111/EXO.31.NIV' },
    { day: 53, chapters: 'Leviticus 1-14', bibleUrl: 'https://www.bible.com/bible/111/LEV.1.NIV' },
    { day: 54, chapters: 'Leviticus 15-27', bibleUrl: 'https://www.bible.com/bible/111/LEV.15.NIV' },
    { day: 55, chapters: 'Numbers 1-18', bibleUrl: 'https://www.bible.com/bible/111/NUM.1.NIV' },
    { day: 56, chapters: 'Numbers 19-36', bibleUrl: 'https://www.bible.com/bible/111/NUM.19.NIV' },
    { day: 57, chapters: 'Deuteronomy 1-17', bibleUrl: 'https://www.bible.com/bible/111/DEU.1.NIV' },
    { day: 58, chapters: 'Deuteronomy 18-34', bibleUrl: 'https://www.bible.com/bible/111/DEU.18.NIV' },
    { day: 59, chapters: 'Joshua', bibleUrl: 'https://www.bible.com/bible/111/JOS.1.NIV' },
    { day: 60, chapters: 'Judges & Ruth', bibleUrl: 'https://www.bible.com/bible/111/JDG.1.NIV' },
    { day: 61, chapters: '1 Samuel', bibleUrl: 'https://www.bible.com/bible/111/1SA.1.NIV' },
    { day: 62, chapters: '2 Samuel', bibleUrl: 'https://www.bible.com/bible/111/2SA.1.NIV' },
    { day: 63, chapters: '1 Kings', bibleUrl: 'https://www.bible.com/bible/111/1KI.1.NIV' },
    { day: 64, chapters: '2 Kings', bibleUrl: 'https://www.bible.com/bible/111/2KI.1.NIV' },
    { day: 65, chapters: '1 Chronicles', bibleUrl: 'https://www.bible.com/bible/111/1CH.1.NIV' },
    { day: 66, chapters: '2 Chronicles', bibleUrl: 'https://www.bible.com/bible/111/2CH.1.NIV' },
    { day: 67, chapters: 'Ezra & Nehemiah', bibleUrl: 'https://www.bible.com/bible/111/EZR.1.NIV' },
    { day: 68, chapters: 'Esther & Job 1-20', bibleUrl: 'https://www.bible.com/bible/111/EST.1.NIV' },
    { day: 69, chapters: 'Job 21-42', bibleUrl: 'https://www.bible.com/bible/111/JOB.21.NIV' },
    { day: 70, chapters: 'Psalms 1-50', bibleUrl: 'https://www.bible.com/bible/111/PSA.1.NIV' },
    { day: 71, chapters: 'Psalms 51-100', bibleUrl: 'https://www.bible.com/bible/111/PSA.51.NIV' },
    { day: 72, chapters: 'Psalms 101-150', bibleUrl: 'https://www.bible.com/bible/111/PSA.101.NIV' },
    { day: 73, chapters: 'Proverbs', bibleUrl: 'https://www.bible.com/bible/111/PRO.1.NIV' },
    { day: 74, chapters: 'Ecclesiastes & Song of Solomon', bibleUrl: 'https://www.bible.com/bible/111/ECC.1.NIV' },
    { day: 75, chapters: 'Isaiah 1-33', bibleUrl: 'https://www.bible.com/bible/111/ISA.1.NIV' },
    { day: 76, chapters: 'Isaiah 34-66', bibleUrl: 'https://www.bible.com/bible/111/ISA.34.NIV' },
    { day: 77, chapters: 'Jeremiah 1-26', bibleUrl: 'https://www.bible.com/bible/111/JER.1.NIV' },
    { day: 78, chapters: 'Jeremiah 27-52 & Lamentations', bibleUrl: 'https://www.bible.com/bible/111/JER.27.NIV' },
    { day: 79, chapters: 'Ezekiel 1-24', bibleUrl: 'https://www.bible.com/bible/111/EZK.1.NIV' },
    { day: 80, chapters: 'Ezekiel 25-48', bibleUrl: 'https://www.bible.com/bible/111/EZK.25.NIV' },
    { day: 81, chapters: 'Hosea, Joel & Amos', bibleUrl: 'https://www.bible.com/bible/111/HOS.1.NIV' },
    { day: 82, chapters: 'Obadiah, Jonah, Micah & Nahum', bibleUrl: 'https://www.bible.com/bible/111/OBA.1.NIV' },
    { day: 83, chapters: 'Habakkuk, Zephaniah, Haggai & Zechariah', bibleUrl: 'https://www.bible.com/bible/111/HAB.1.NIV' },
    { day: 84, chapters: 'Malachi & 1 Corinthians 1-9', bibleUrl: 'https://www.bible.com/bible/111/MAL.1.NIV' },
    { day: 85, chapters: '1 Corinthians 10-16 & 2 Corinthians 1-7', bibleUrl: 'https://www.bible.com/bible/111/1CO.10.NIV' },
    { day: 86, chapters: '2 Corinthians 8-13 & Galatians', bibleUrl: 'https://www.bible.com/bible/111/2CO.8.NIV' },
    { day: 87, chapters: 'Ephesians, Philippians & Colossians', bibleUrl: 'https://www.bible.com/bible/111/EPH.1.NIV' },
    { day: 88, chapters: '1 Thessalonians, 2 Thessalonians, 1 Timothy & 2 Timothy', bibleUrl: 'https://www.bible.com/bible/111/1TH.1.NIV' },
    { day: 89, chapters: 'Titus, Philemon & Jude', bibleUrl: 'https://www.bible.com/bible/111/TIT.1.NIV' },
    { day: 90, chapters: 'Review & Reflection — All 90 Days Complete! 🎉', bibleUrl: 'https://www.bible.com/reading-plans' },
];

/** Full reading plan with computed scheduled dates */
export const READING_PLAN: ReadingPlanEntry[] = PLAN.map((entry) => ({
    ...entry,
    scheduledDate: getScheduledDateStr(entry.day),
}));

/** Get the plan entry for a specific day number */
export function getPlanForDay(day: number): ReadingPlanEntry | undefined {
    return READING_PLAN.find((e) => e.day === day);
}

/** Get all days that are past their scheduled date and not yet completed */
export function getMissedDays(completedDays: Set<number>): ReadingPlanEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return READING_PLAN.filter((entry) => {
        const scheduled = new Date(entry.scheduledDate + 'T00:00:00');
        return scheduled <= today && !completedDays.has(entry.day);
    });
}

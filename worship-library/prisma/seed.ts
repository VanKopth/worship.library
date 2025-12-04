import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../prisma/generated/client";
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const songTitles = [
    "Amazing Grace",
    "How Great Thou Art",
    "Blessed Assurance",
    "Holy Holy Holy",
    "Great Is Thy Faithfulness",
    "It Is Well With My Soul",
    "What A Friend We Have In Jesus",
    "Crown Him With Many Crowns",
    "Come Thou Fount",
    "Be Thou My Vision",
    "In Christ Alone",
    "10,000 Reasons",
    "Oceans (Where Feet May Fail)",
    "Cornerstone",
    "Good Good Father",
    "Reckless Love",
    "Way Maker",
    "Build My Life",
    "Goodness of God",
    "The Blessing",
    "Raise A Hallelujah",
    "King of Kings",
    "Yes I Will",
    "Living Hope",
    "Surrounded (Fight My Battles)",
    "O Come to the Altar",
    "Great Are You Lord",
    "What a Beautiful Name",
    "So Will I",
    "Who You Say I Am",
    "This Is Amazing Grace",
    "No Longer Slaves",
    "Forever (We Sing Hallelujah)",
    "Do It Again",
    "Open Up The Heavens",
    "Here's My Heart",
    "Worthy of Your Name",
    "All My Hope",
    "Ever Be",
    "You Make Me Brave",
    "One Thing Remains",
    "Jesus We Love You",
    "Graves Into Gardens",
    "Jireh",
    "Champion",
    "Shout to the Lord",
    "Mighty to Save",
    "Revelation Song",
    "How He Loves",
    "All Sons and Daughters"
];

async function main() {
    console.log('🌱 Starting seed...');

    await prisma.song.deleteMany({});
    console.log('🗑️  Cleared existing songs');

    for (let i = 0; i < songTitles.length; i++) {
        await prisma.song.create({
            data: {
                songTitle: songTitles[i],
                songText: `Текст пісні "${songTitles[i]}"\n\nVerse 1:\nLorem ipsum dolor sit amet\n\nChorus:\nConsectetur adipiscing elit\n\nVerse 2:\nSed do eiusmod tempor`,
                audioUrl: `https://example.com/audio/${i + 1}.mp3`,
            },
        });
        console.log(`✅ Added: ${songTitles[i]}`);
    }

    console.log('✨ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
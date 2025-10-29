import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const RSS_SOURCES = [
  {
    name: 'Bleeping Computer',
    url: 'https://www.bleepingcomputer.com/feed/',
    description: 'Latest cybersecurity news and tutorials',
    isActive: true,
  },
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    description: 'Cybersecurity news and analysis',
    isActive: true,
  },
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    description: 'In-depth security news and investigation',
    isActive: true,
  },
  {
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    description: 'Cybersecurity news for infosec professionals',
    isActive: true,
  },
  {
    name: 'Hacker News (Security)',
    url: 'https://thehackernews.com/feeds/posts/default',
    description: 'The latest hacking news and security updates',
    isActive: true,
  },
];

async function main() {
  console.log('Seeding RSS sources...');

  for (const source of RSS_SOURCES) {
    const existing = await prisma.rSSSource.findUnique({
      where: { url: source.url },
    });

    if (existing) {
      console.log(`✓ RSS source already exists: ${source.name}`);
    } else {
      await prisma.rSSSource.create({
        data: source,
      });
      console.log(`✓ Created RSS source: ${source.name}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

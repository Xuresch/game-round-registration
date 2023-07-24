// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function main() {
  // Creating users
  const admins = [];
  const organisators = [];
  const users = [];
  const temporary = [];

  for (let i = 1; i <= 2; i++) {
    const admin = await prisma.user.create({
      data: {
        username: `adminUser${i}`,
        email: `adminUser${i}@example.com`,
        password: `password${i}`,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    admins.push(admin);
  }

  for (let i = 1; i <= 2; i++) {
    const organisator = await prisma.user.create({
      data: {
        username: `organisatorUser${i}`,
        email: `organisatorUser${i}@example.com`,
        password: `password${i}`,
        role: "organisator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    organisators.push(organisator);
  }

  for (let i = 1; i <= 4; i++) {
    const user = await prisma.user.create({
      data: {
        username: `normalUser${i}`,
        email: `normalUser${i}@example.com`,
        password: `password${i}`,
        role: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    users.push(user);
  }

  for (let i = 1; i <= 12; i++) {
    const temp = await prisma.user.create({
      data: {
        username: `tempUser${i}`,
        email: `tempUser${i}@example.com`,
        password: `password${i}`,
        role: "temporary",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    temporary.push(temp);
  }

  // Creating events
  events = [];
  for (let i = 1; i <= 3; i++) {
    const startDate = new Date();
    startDate.setDate(
      startDate.getDate() + Math.floor(Math.random() * 100) + 1
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 10) + 1);

    orga = getRandomItem(organisators);

    const event = await prisma.event.create({
      data: {
        organizerId: orga.id,
        name: `Event ${i}`,
        description: `Description ${i}`,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    events.push(event);
  }

  // Creating game rounds related to events
  gameRounds = [];
  for (let i = 1; i <= 12; i++) {
    gameRoundEvent = getRandomItem(events);
    gameMaster = getRandomItem(users);
    gameType = getRandomItem(["roleplay", "boardgame", "tabletop"]);
    if (gameType === "roleplay") {
      gameSystem = getRandomItem(["DnD", "DAS", "Cthulu", "Generic"]);
    } else {
      gameSystem = null;
    }
    genre = getRandomItem([
      "Fantasy",
      "SyFi",
      "GrimDark",
      "Genre 1",
      "Genre 2",
      "Genre 3",
    ]);
    recommendedAge = getRandomItem([12, 16, 18]);
    playerLimit = getRandomItem([3, 4, 5, 6]);
    waitingList = getRandomItem([true, false]);

    const startTime = new Date(gameRoundEvent.startDate);
    startTime.setDate(startTime.getDate() + Math.floor(Math.random()));
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + Math.floor(Math.random()));

    const gameRound = await prisma.gameRound.create({
      data: {
        eventId: gameRoundEvent.id,
        gameMasterId: gameMaster.id,
        name: `GameRound ${i}`,
        description: `Description ${i}`,
        gameType,
        genre,
        gameSystem,
        recommendedAge,
        startTime,
        endTime,
        playerLimit,
        waitingList,
        extraDetails: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    gameRounds.push(gameRound);
  }

  // Creating player registrations

  for (let i = 1; i <= 20; i++) {
    gameRound = getRandomItem(gameRounds);
    player = getRandomItem(temporary);

    if (gameRound.waitingList) {
      status = getRandomItem(["registered", "waiting"]);
    } else {
      status = "registered";
    }

    await prisma.playerRegistration.create({
      data: {
        playerId: player.id,
        gameRoundId: gameRound.id,
        status,
        joinedAt: new Date(),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Starts a rotating presence cycle for the bot.
 *
 * The bot will switch between all configured messages at a fixed interval.
 *
 * @param {Client} client - The Discord client instance.
 * @param {number} interval - The time (ms) between rotations.
*/

export function startPresenceRotator(client, interval = 15000) {
  const statuses = [
    { name: 'Bot exclusivo Earth Trad3s', type: 3 },
    { name: 'A maior rede de trocas!', type: 3 },
    { name: 'Desenvolvedor: giovannipereiradev', type: 0 }
  ];

  let index = 0;

  setInterval(() => {
    const next = statuses[index];

    client.user.setPresence({
      activities: [next],
      status: 'online'
    });

    index = (index + 1) % statuses.length;
  }, interval);
}
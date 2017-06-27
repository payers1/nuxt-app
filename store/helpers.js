import axios from 'axios'

const get = (url) => axios({
  url,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
});

export async function getData({store}) {
  const randomOffset = Math.floor(Math.random(0) * 100);
  const resp = await get('https://api.github.com/users?per_page=5&since=' + randomOffset)

  const users = resp.data.map(async user => {
    const { data } = await get(user.url);
    const receivedEventsUrl = `https://api.github.com/users/${user.id}/received_events/public`
    const { data: events} = await get(receivedEventsUrl);
    data.events = events;
    return data;
  })
  const d = await Promise.all(users);
  store.commit('init', d)
}

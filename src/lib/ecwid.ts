interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey: string;
  wrappedByList: boolean;
}

/**
 * Fetches data from Ecwid API
 * @param endpoint - the endpoint to fetch from
 * @param query - The query parameter to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList
 */

export default async function fetchAPI<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(
    `${import.meta.env.EWID_URL}/api/v3/${import.meta.env.STORE_ID}/${endpoint}`
  );

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${import.meta.env.ECWID_SECRET}`,
    },
  });
  let data = await res.json();

  if (wrappedByKey) {
    data = data['wrappedByKey'];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT,
  process.env.NEXT_PUBLIC_SEARCH_API_KEY
).searchClient;

export const SEARCH_INDEX_NAME = 'products';

export const searchProducts = async (query) => {
  const queries = [{ params: { query }, indexName: SEARCH_INDEX_NAME }];
  const data = await searchClient.search(queries);
  // We need to extract the 'hits' from the first result object
  return data?.results?.[0]?.hits || [];
};

export default searchClient;

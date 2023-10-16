import axios from "axios";

/**
 * Defines the schema for the WikipediaPage type and the Query type for retrieving Wikipedia page data.
 */
export const typeDefs = `
  " A Wikipedia page. "
  type WikipediaPage {
    " The title of the Wikipedia page. "
    title: String!
    " The total number of views for the Wikipedia page for the given time period. "
    totalViews: Int!
  }
  
  type Query {
    " Gets the total views of a Wikipedia page for a given month. "
    getWikipediaPageByMonth(title: String!, targetMonth: String!): WikipediaPage
  }
`;

/**
 * Resolvers for the Wikipedia GraphQL type.
 */
export const resolvers = {
  /**
   * Query to get the total views of a Wikipedia page for a given month.
   * @param _ Unused parent object.
   * @param title Title of the Wikipedia page.
   * @param targetMonth Target month in "yyyy-mm" format.
   * @returns Object containing the title of the page and its total views for the given month.
   */
  Query: {
    getWikipediaPageByMonth: async (_: any, { title, targetMonth }: any) => {
      const totalViews = await getPageviews(title, targetMonth);
      return { title, totalViews };
    },
  },
};

// Function to fetch Pageviews and sum them up
/**
 * Fetches the total pageviews for a given Wikipedia article for a specific month.
 * @param title - The title of the Wikipedia article.
 * @param targetMonth - The target month in the format "yyyy-mm".
 * @returns The total number of pageviews for the given article and month.
 */
export async function getPageviews(title: string, targetMonth: string) {

  // Convert targetMonth "yyyy-mm" to "yyyymmdd00"
  const [year, month] = targetMonth.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const formattedTargetMonthStart = `${targetMonth.replace("-", "")}0100`;
  const formattedTargetMonthEnd = `${targetMonth.replace("-", "")}${lastDay}00`;

  console.log("Fetching pageviews for:", title, targetMonth);
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${title}/daily/${formattedTargetMonthStart}/${formattedTargetMonthEnd}`;
  console.log("url:", url);

  const response = await axios.get(url);
  const data = response.data;

  // Sum up the views
  let totalViews = 0;
  for (const item of data.items) {
    console.log("day:", item);
    totalViews += item.views;
  }
  console.log("totalViews:", totalViews);
  return totalViews;
}

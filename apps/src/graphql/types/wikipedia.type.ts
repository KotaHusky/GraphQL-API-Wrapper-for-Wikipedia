import axios from "axios";

export const typeDefs = `
  type WikipediaPage {
    title: String!
    totalViews: Int!
  }

  type Query {
    getWikipediaPageByMonth(title: String!, targetMonth: String!): WikipediaPage
  }
`;

// title is string
// startDate is "yyyy-mm-dd" or "yyyy-mm"
// endDate is "yyyy-mm-dd" or "yyyy-mm"

export const resolvers = {
  Query: {
    getWikipediaPageByMonth: async (_: any, { title, targetMonth }: any) => {
      const totalViews = await getPageviews(title, targetMonth);
      return { title, totalViews };
    },
  },
};

// Function to fetch Pageviews and sum them up
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

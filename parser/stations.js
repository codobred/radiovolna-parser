const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const countries = Object.entries(require("../config/countries"));

const TARGET_URL = "https://radiovolna.net";

const loadHTML = async link => {
  let html = await fetch(link);
  html = await html.text();
  return cheerio.load(html);
};

const parseStationInfo = async url => {
  const $ = await loadHTML(url);
  const title = $(".artist.radio h1").text().trim();
  const image = $(".artist.radio figure img").attr("src");
  const stream_url = $("#player_container .jp-play").data("stream");

  return {
    title,
    image,
    stream_url
  };
};

const parseCountry = async (link, code) => {
  const $ = await loadHTML(link);

  const links = [];
  $(".radio-stations .item").each((i, el) => {
    const url = $(el)
      .find("a")
      .attr("href");

    links.push(TARGET_URL + url);
  });

  // get list of stations
  const res = await Promise.all(links.map(parseStationInfo));

  // save parsed data into JSON file
  saveData(code, res);
};

const saveData = (name, data) => {
  fs.writeFile();
}

module.exports = async () => {
  console.info(`Start parsing radio charts for ${countries.length} countries`);
  await Promise.all(countries.map(async ([code, { slug, title }], i) => {
    if (i > 0) {
      return;
    }

    console.log(`Start parsing all station in ${title}`);

    await parseCountry(TARGET_URL + slug, code);
  }));
};

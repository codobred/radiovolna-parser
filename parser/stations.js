const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const countries = Object.entries(require("../config/countries"));

const TARGET_URL = "http://radiovolna.net";

const loadHTML = async link => {
  let html = await fetch(link);
  html = await html.text();
  return cheerio.load(html);
};

const sleep = seconds => {
  return new Promise(resolve => {
    setTimeout(resolve, 3000);
  });
};

const parseStationInfo = async url => {
  const $ = await loadHTML(url);
  const title = $(".artist.radio h1")
    .text()
    .trim();
  const image = $(".artist.radio figure img").attr("src");
  const stream_url = $("#player_container .jp-play").data("stream");

  return {
    title,
    image,
    stream_url
  };
};

const parseCountry = async link => {
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
  return res;
};

const saveData = (name, data) => {
  fs.writeFile(
    path.resolve(`parsed_data/${name}.json`),
    JSON.stringify(data),
    console.warn
  );
};

module.exports = async () => {
  console.info(`Start parsing radio charts for ${countries.length} countries`);
  const stations = {};

  await Promise.all(
    countries.map(async ([code, { slug, title }]) => {
      console.log(`Start parsing all station in ${title}`);
      await sleep(300);

      stations[code] = await parseCountry(TARGET_URL + slug);
    })
  );

  saveData("stations", stations);
};

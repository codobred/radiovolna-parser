const prompts = require("prompts");

const PARSING_TYPES = {
  stations: require("./parser/stations")
};

const run = async () => {
  while (true) {
    console.clear();

    const { parser } = await prompts({
      type: "select",
      name: "parser",
      message: "Select parse method",
      choices: [
        { title: "Radio stations by countries", value: PARSING_TYPES.stations }
      ],
      initial: 0
    });

    await parser();
    await prompts({
      type: "text",
      name: "parser",
      message: "continue ..."
    });
  }
};

// run app
run();

const { createReadStream } = require("fs");
const { parse } = require("csv-parse");
const { transform } = require("stream-transform");
const { join } = require("path");

const csvFilePath = join(__dirname, "adult.csv");

const filteredRecords = [];

const parser = parse({
  comment: "#",
  delimiter: ",",
  columns: true,
});

const filterRecords = transform((record, callback) => {
  setTimeout(() => {
    if (record && record.income === ">50K") {
      filteredRecords.push(record);
    }
    callback(null, "");
  }, 500);
});

const csvStream = createReadStream(csvFilePath);

csvStream
  .pipe(parser)
  .pipe(filterRecords)
  .on("end", () => {
    console.log(JSON.stringify(filteredRecords, null, 2));
  });

parser.on("data", function (record) {
  console.log(filteredRecords);
});

parser.on("end", function () {
  console.log("CSV parsing completed.");
});

parser.on("error", function (err) {
  console.error("Error parsing CSV:", err.message);
});

filterRecords.on("finish", function () {
  console.log("Filtering completed.");
});

filterRecords.on("error", function (err) {
  console.error("Error during filtering:", err.message);
});

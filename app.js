const { createReadStream } = require("fs");
const { parse } = require("csv-parse");
const { transform } = require("stream-transform");
const { join } = require("path");

const csvFilePath = join(__dirname, "adult.csv");

const records = [];

const parser = parse({
  comment: "#",
  delimiter: ",",
  columns: true,
});

const filterRecords = transform((record, callback) => {
  setTimeout(() => {
    if (record && record.income === ">50K") {
      const transformedRecord = Object.values(record).join(" ") + "\n";
      callback(null, transformedRecord);
    } else {
      callback(null, "");
    }
  }, 500);
});

const csvStream = createReadStream(csvFilePath);

csvStream.pipe(parser).pipe(filterRecords).pipe(process.stdout);

parser.on("data", function (record) {
  if (record && record.income === ">50K") {
    records.push(record);
  }
});

parser.on("end", function () {
  console.log("CSV parsing completed.");
  console.log("Records with income > 50K:", records.length);
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

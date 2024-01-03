const { createReadStream } = require("fs");
const { parse } = require("csv-parse");
const { transform } = require("stream-transform");
const { join } = require("path");

const csvFilePath = join(__dirname, "adult.csv");

const records = [];

const parser = parse({
  delimiter: ",",
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
  skip_lines_with_error: true,
  skip_lines_with_empty_values: true,
});

const transformer = transform((record, callback) => {
  setTimeout(() => {
    if (Array.isArray(record)) {
      const transformedRecord = Object.values(record).join(" ") + "\n";
      callback(null, transformedRecord);
    } else if (typeof record === "object") {
      const transformedRecord = Object.values(record).join(" ") + "\n";
      callback(null, transformedRecord);
    } else {
      callback(null, "");
    }
  }, 500);
});


const csvStream = createReadStream(csvFilePath);

csvStream.pipe(parser).pipe(transformer).pipe(process.stdout);

parser.on("data", function (record) {
  records.push(record);
});

parser.on("end", function () {
  console.log("CSV parsing completed.");
  console.log(records); 
});

parser.on("error", function (err) {
  console.error("Error parsing CSV:", err.message);
});

transformer.on("finish", function () {
  console.log("Transformation completed.");
});

transformer.on("error", function (err) {
  console.error("Error during transformation:", err.message);
});

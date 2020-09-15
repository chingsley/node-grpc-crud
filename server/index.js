// requirements
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

// knex
const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile.js")[environment];
const knex = require("knex")(config);

// grpc service definition
const productProtoPath = path.join(__dirname, "..", "protos", "product.proto");
const productProtoDefinition = protoLoader.loadSync(productProtoPath);
const productPackageDefinition = grpc.loadPackageDefinition(
  productProtoDefinition
).product;

// knex queries
function listProducts(call, callback) {}
function readProduct(call, callback) {}
function createProduct(call, callback) {}
function updateProduct(call, callback) {}
function deleteProduct(call, callback) {}

// main
function main() {
  const server = new grpc.Server();
  // gRPC service
  server.addService(productPackageDefinition.ProductService.service, {
    listProducts: listProducts,
    readProduct: readProduct,
    createProduct: createProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
  });
  // gRPC server
  server.bind("localhost:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("gRPC server running at http://127.0.0.1:50051");
}

main();

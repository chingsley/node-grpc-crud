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
function listProducts(call, callback) {
  /*
  Using 'grpc.load'? Send back an array: 'callback(null, { data });'
  */
  knex("products").then((data) => {
    callback(null, { products: data });
  });
}

function readProduct(call, callback) {
  knex("products")
    .where({ id: parseInt(call.request.id) })
    .then((data) => {
      if (data.length) {
        callback(null, data[0]);
      } else {
        callback(
          `Product not found; no product matches the id of ${call.request.id}`
        );
      }
    });
}
function createProduct(call, callback) {
  knex("products")
    .insert({ name: call.request.name, price: call.request.price })
    .then((result) => {
      console.log("result = ", result);
      callback(null, { status: "success" });
    })
    .catch((error) => {
      // when an error is thrown, it does not get to this catch block ????????
      console.log(">>>>>>>>>>>. error = ", error);
    });
}
function updateProduct(call, callback) {
  knex("products")
    .where({ id: parseInt(call.request.id) })
    .update({
      name: call.request.name,
      price: call.request.price,
    })
    .returning()
    .then((data) => {
      if (data) {
        callback(null, { status: "success" });
      } else {
        callback(`no product matches the id of ${call.request.id}`);
      }
    });
}
function deleteProduct(call, callback) {
  knex("products")
    .where({ id: parseInt(call.request.id) })
    .delete()
    .returning()
    .then((data) => {
      if (data) {
        callback(null, { status: "success" });
      } else {
        callback(`no product matches the id of ${call.request.id}`);
      }
    });
}

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

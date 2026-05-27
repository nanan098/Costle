const mongoose = require("mongoose");

// Definiujemy strukturę produktu
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Cena, którą gracz będzie zgadywał
  category: {
    type: String,
    required: true,
    enum: ["Spożywcze", "Technologia", "Ekskluzywne"], // Tutaj definiujesz swoje 3 sztywne kategorie
  },
  releaseDate: { type: Date, required: true }, // Data produktu
  image: { type: String },
});

// Tworzymy model na podstawie schematu
module.exports = mongoose.model("Product", ProductSchema);

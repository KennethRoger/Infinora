const mongoose = require("mongoose");

const variantTypesSchema = new mongoose.Schema({
    name: { type: String, required: true },
})
const variantsSchema = new mongoose.Schema({
    variantName: {
        type: String,
        required: true,
    },
    variantTypes: {
        type: [variantTypesSchema],
        required: true,
    },
})

const vendorVariantSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    variants: {
        type: [variantsSchema],
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("VendorVariant", vendorVariantSchema);
const taxConfig = require('../config/tax')

exports.calculateItemsSalesTax = item => {
    const products = item.map(item => {

        item.priceWithTax = 0;
        item.totalPrice = 0;
        item.totalTax = 0;
        item.purchasePrice = item.price;

        const price = item.purchasePrice
        const quantity = item.quantity;
        item.totalPrice = parseFloat(Number((price * quantity).toFixed(2)));

        if (item.taxable) {
            const taxAmount = price * (taxConfig.stateTaxRate / 100) * 100;
            item.totalTax = parseFloat(Number(taxAmount * quantity).toFixed(2))
            item.priceWithTax = parseFloat(
                Number((item.totalPrice + item.totalTax).toFixed(2))
            );
        }
        return item
    })
    return products;
}
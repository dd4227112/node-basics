function replaceHtml(page, product) {
    let productOutput = page.replace('{{%IMAGE_URL%}}', product.productImage)
    productOutput = productOutput.replace('{{%NAME%}}', product.name)
    productOutput = productOutput.replace('{{%ALT_NAME%}}', product.name)
    productOutput = productOutput.replace('{{%COLOR%}}', product.color)
    productOutput = productOutput.replace('{{%ROM%}}', product.ROM)
    productOutput = productOutput.replace('{{%SIZE%}}', product.size)
    productOutput = productOutput.replace('{{%CAMERA%}}', product.camera)
    productOutput = productOutput.replace('{{%PRICE%}}', product.price)
    productOutput = productOutput.replace('{{%ID%}}', product.id)
    productOutput = productOutput.replace('{{%DESCRIPTION%}}', product.description)
    productOutput = productOutput.replace('{{%MODE_NAME%}}', product.modelName)
    productOutput = productOutput.replace('{{%MODE_NUMBER%}}', product.modelNumber)
    return productOutput
}
function myDate() {
    return Date();
}
export { replaceHtml, myDate }


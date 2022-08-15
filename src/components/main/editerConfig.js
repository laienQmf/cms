let fontSzie = '',lineHeight= ''
for(let i = 0;i <= 40;i++){
  fontSzie += `${i}px `
}
for(let i = 15;i <= 35;i++){
    lineHeight += `${i}px `
}
module.exports = {
    fontsize_formats:fontSzie,
    lineheight_formats:lineHeight,
    style_formats:[]
}
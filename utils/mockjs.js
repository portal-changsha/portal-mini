
export function mockXHR(url) {
  let jsonUrl = url
  if(jsonUrl.indexOf('?') >= 0){
    jsonUrl = jsonUrl.split('?')[0]
  }
  jsonUrl = jsonUrl.split('app')[1].split('/').slice(1).join('.')
  const dataJson = require(`../mock/${jsonUrl}.json`)
  return dataJson
}
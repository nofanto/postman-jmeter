module.exports.processSampler = function (samplerItem, builder){

    var headerContent = '',
    headerItemContent = '',
    samplerContent ='';
        
    if(samplerItem.request.header.length > 0)
    {
        //get header
        for (let index = 0; index < samplerItem.request.header.length; index++) {
          const headerItem = samplerItem.request.header[index];
          var resultItem = builder.getHeaderManagerItem(headerItem.key, headerItem.value);
          headerItemContent += resultItem;
        }
        
        headerContent = builder.getHashTree(builder.getHeaderManagerCollection(headerItemContent), false);
      }
      
    //get sampler
    var samplerName = samplerItem.name,
    samplerProtocol = samplerItem.request.url.protocol,
    samplerServer = samplerItem.request.url.host.join('.'),
    samplerPort = '',
    samplerPath = samplerItem.request.url.path.join('/'),
    samplerHTTPMethod = samplerItem.request.method,
    samplerArgsString = '';

    if(samplerItem.request.url.query == undefined){
        samplerArgsString = builder.getHTTPSamplerArgs(samplerHTTPMethod,new Array(eval('samplerItem.request.body.' + samplerItem.request.body.mode)));
    }
    else{
        samplerArgsString = builder.getHTTPSamplerArgs(samplerHTTPMethod, samplerItem.request.url.query);
    }

    samplerContent += builder.getHTTPSampler(samplerName, samplerProtocol, samplerServer, samplerPort, samplerPath, samplerHTTPMethod, samplerArgsString);
    samplerContent += builder.getHashTree(headerContent, true);

    return samplerContent;
      
}
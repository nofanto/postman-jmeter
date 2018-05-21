var 
program = require('commander'),
fs = require('fs'),
builder = require('../lib/jmeterBuilder.js'),
helper = require('../lib/postmanHelper.js'),
postmanSource = '',
jmeterOutput = '';

program
  .version(require('../package.json').version)
  .description('Convert a Postman collection to Jmeter')
  .option('-i, --postman-file <input-file>', 'Postman file input')
  .option('-o, --jmeter-file <output-file>', 'Jmeter file output')
  .parse(process.argv);


//Read postman collection
try {
  postmanSource = JSON.parse(fs.readFileSync(program.postmanFile, 'utf8'));
} catch (error) {
  console.log('Error on input file, %s', error);
  process.exit(1);
}

//Do conversion
try {
  
  var content = '',
  threadGroupsContent = '';

  for (let index = 0; index < postmanSource.item.length; index++) {
    const threadGroupItem = postmanSource.item[index];
    
    threadGroupsContent += builder.getThreadGroup(threadGroupItem.name);
     
    var samplerContent = '';
    //get sampler
    if(threadGroupItem.item == undefined)
    {
      const samplerItem = threadGroupItem;
      samplerContent = helper.processSampler(samplerItem, builder);
      threadGroupsContent += builder.getHashTree(samplerContent,true);
    }
    else
    {
      for (let index = 0; index < threadGroupItem.item.length; index++) {
        const samplerItem = threadGroupItem.item[index];
        samplerContent = helper.processSampler(samplerItem, builder);
        threadGroupsContent += builder.getHashTree(samplerContent,true);
      }
    } 
  }
    
  //test plan
  content = builder.getTestPlan(postmanSource.info.name);
  content += builder.getHashTree(threadGroupsContent, true);
    
  //main document
  jmeterOutput = builder.getMainDocument(builder.getHashTree(content, true));

} catch (error) {
  console.log('Error on converting file, %s ', error);
  process.exit(1);
}

//Write result
try {
  fs.writeFileSync(program.jmeterFile,jmeterOutput);
} catch (error) {
  console.log('Error on writing file, %s', error);
  process.exit(1);
}

process.exit(0);
  
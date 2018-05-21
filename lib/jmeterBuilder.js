

module.exports.getMainDocument = function (content){
    validateStringArgs(arguments,'getMainDocument');

    return '<?xml version="1.0" encoding="UTF-8"?>\n<jmeterTestPlan version="1.2" properties="3.1" jmeter="3.1 r1770033">' + content +'\n</jmeterTestPlan>';
    
};

module.exports.getHashTree = function (obj, isNested){
    
    if(isNested){
        return '<hashTree>' + obj + '</hashTree>\n';
    }
    return obj + '\n<hashTree/>\n';
};

module.exports.getThreadGroup = function(name){
    validateStringArgs(arguments,'getThreadGroup');
    
    var output = '<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="' + name + '" enabled="true">\n';
    output += '<stringProp name="ThreadGroup.on_sample_error">continue</stringProp>\n';
    output += '<elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">\n';
    output += '<boolProp name="LoopController.continue_forever">false</boolProp>\n';
    output += '<stringProp name="LoopController.loops">1</stringProp>\n';
    output += '</elementProp>\n';
    output += '<stringProp name="ThreadGroup.num_threads">1</stringProp>\n';
    output += '<stringProp name="ThreadGroup.ramp_time">1</stringProp>\n<longProp name="ThreadGroup.start_time">1526025465000</longProp>\n<longProp name="ThreadGroup.end_time">1526025465000</longProp>\n';
    output += '<boolProp name="ThreadGroup.scheduler">false</boolProp>\n<stringProp name="ThreadGroup.duration"></stringProp>\n<stringProp name="ThreadGroup.delay"></stringProp>\n</ThreadGroup>\n';  
    return output;  
};

module.exports.getTestPlan = function(name){
    validateStringArgs(arguments,'getTestPlan');
    var output = '<TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="'+ name +'" enabled="true">\n';
    output += '<stringProp name="TestPlan.comments"></stringProp>\n<boolProp name="TestPlan.functional_mode">false</boolProp>\n<boolProp name="TestPlan.serialize_threadgroups">false</boolProp>\n';
    output += '<elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">\n';
    output += '<collectionProp name="Arguments.arguments"/>\n</elementProp>\n<stringProp name="TestPlan.user_define_classpath"></stringProp>\n</TestPlan>';
    return output;
};

module.exports.getHTTPSampler = function(name, protocol, server, port, path, httpMethod, argsString){
    validateStringArgs(arguments,'getHTTPSampler');
    var output= '<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="'+ name +'" enabled="true">\n';
    output += argsString + '\n';
    output += '<stringProp name="HTTPSampler.domain">'+ server + '</stringProp>\n<stringProp name="HTTPSampler.port">' + port + '</stringProp>\n';          
    output += '<stringProp name="HTTPSampler.connect_timeout"></stringProp>\n<stringProp name="HTTPSampler.response_timeout"></stringProp>\n<stringProp name="HTTPSampler.protocol">'+ protocol + '</stringProp>\n';            
    output += '<stringProp name="HTTPSampler.contentEncoding"></stringProp>\n<stringProp name="HTTPSampler.path">'+ path +'</stringProp>\n<stringProp name="HTTPSampler.method">' + httpMethod + '</stringProp>\n';      
    output += '<boolProp name="HTTPSampler.follow_redirects">true</boolProp>\n<boolProp name="HTTPSampler.auto_redirects">false</boolProp>\n<boolProp name="HTTPSampler.use_keepalive">true</boolProp>\n<boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>\n<boolProp name="HTTPSampler.monitor">false</boolProp>\n<stringProp name="HTTPSampler.embedded_url_re"></stringProp>\n</HTTPSamplerProxy>\n';     
    return output;
};

module.exports.getHTTPSamplerArgs = function(httpMethod,args){
    var output= '';
    switch(httpMethod)
    {
        case 'GET':
        output += '<elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">\n';
        output += '<collectionProp name="Arguments.arguments">\n';
        for (let index = 0; index < args.length; index++) {
            const arg = args[index];
            output += '<elementProp name="'+ arg.key + '" elementType="HTTPArgument"><boolProp name="HTTPArgument.always_encode">true</boolProp><stringProp name="Argument.value">'+ arg.value +'</stringProp><stringProp name="Argument.metadata">=</stringProp><boolProp name="HTTPArgument.use_equals">'+ arg.equals +'</boolProp><stringProp name="Argument.name">'+ arg.key +'</stringProp></elementProp>\n';
        }
        output += '</collectionProp>\n</elementProp>';
        break;

        case 'POST':
        output += '<boolProp name="HTTPSampler.postBodyRaw">true</boolProp>\n<elementProp name="HTTPsampler.Arguments" elementType="Arguments">\n<collectionProp name="Arguments.arguments">\n';
        output += '<elementProp name="" elementType="HTTPArgument">\n<boolProp name="HTTPArgument.always_encode">false</boolProp>\n<stringProp name="Argument.value">'+ encodeXml(args[0]) +'</stringProp>\n';
        output += '<stringProp name="Argument.metadata">=</stringProp>\n</elementProp>\n</collectionProp>\n</elementProp>\n';      
        break;
    }
    return output;

};

module.exports.getHeaderManagerCollection = function(collectionItem){
    validateStringArgs(arguments,'getHeaderManagerCollection');
    var output = '<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">\n';
    output += '<collectionProp name="HeaderManager.headers">' + collectionItem + '</collectionProp>\n</HeaderManager>';
    return output;
};

module.exports.getHeaderManagerItem = function(name, value){
    validateStringArgs(arguments,'getHeaderManagerItem');
    return '<elementProp name="" elementType="Header">\n<stringProp name="Header.name">'+ name +'</stringProp>\n<stringProp name="Header.value">'+ value +'</stringProp>\n</elementProp>\n';
};

function validateStringArgs(args, methodName){
    for (let index = 0; index < args.length; index++) {
        const element = args[index];
        if(typeof(element)!= 'string')
        {
            throw 'Invalid parameter on ' + methodName;
        }
    }
}

function encodeXml(args) {
    return args.replace(/([\&"<>])/g, function(str, item) {
        var xml_special_to_escaped_one_map = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return xml_special_to_escaped_one_map[item];
    });
};

function decodeXml(args) {
    return args.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        function(str, item) {
            var escaped_one_to_xml_special_map = {
                '&amp;': '&',
                '&quot;': '"',
                '&lt;': '<',
                '&gt;': '>'
            };
            return escaped_one_to_xml_special_map[item];
    });
}


// Handling custom Api responses
class ApiResponse{
    // constructor initializes the properties of Apiresponse with the given parameters
    constructor(statusCode,data,message="Success")//Http status code ,data-data returned by API could be object,array or any other data,additional message defaulted to success
    {  
        // Properties set in the constructor
    this.statusCode=statusCode
    this.data=data
    this.message=message
    this.success=statusCode<400 //<400 basically indicates success message
    }
}
export{ApiResponse}



//  For example
//  const response=new ApiResponse(200,{id:1,name:"Hari"},"User name fetched successfully");

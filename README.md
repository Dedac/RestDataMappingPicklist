# Rest Data Mapping Picklist
#### An Azure DevOps Work Item Form Extension

This is an extension for Azure DevOps to load Rest data into a simple picklist.
You can map additional data from the same rest call to other fields in the Work Item

Build the dev version and run locally
1. Build and  the Dev Extension 
    ```
    npm run build-dev
    npm run package-dev
    ```
1. Upload the Visual Studio Marketplace and invite a test organization
1. Setup a local signing certificate here are some sample [instructions](https://gist.github.com/pgilad/63ddb94e0691eebd502deee207ff62bd)  Add the cert in Windows by double clicking it.  You may have to add the cert in your browser settings as well
1. Build and run the extension locally 
    ```
    npm run serve-dev
    ```
1. Install the extension in a work item and configure it
1. Enjoy testing the extension


To Build and package the control for production, simply run 

```
npm run build
```

And upload to the visual studio marketplace
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ config, log }) => ({
    resolversDir: 'src/routers/graphql',
    schemasDir: 'src/schemas',
    scalarFile: 'src/schemas/_scalar',
    // https://github.com/GiladShoham/graphql-apollo-errors#usage
    error: {
        // publicDataPath: 'data', // Only data under this path in the data object will be sent to the client (path parts should be separated by . - some.public.path)
        showLocations: !config.env.prod,
        showPath: !config.env.prod,
        hideSensitiveData: config.env.prod,
        hooks: {
            // This run on the error you really throw from your code (not the graphql error - it means not with path and locations)
            onOriginalError: (originalError) => { log.error(originalError.message); },
            // This will run on the processed error, which means after we convert it to boom error if needed
            // and after we added the path and location (if requested)
            // If the error is not a boom error, this error won't include the original message but general internal server error message
            // This will run before we take only the payload and the public path of data
            onProcessedError: (processedError) => { log.error(processedError.message); },
            // This will run on the final error, it will only contains the output.payload, and if you configured the publicDataPath
            // it will only contain this data under the data object
            // If the error is internal error this error will be a wrapped internal error which not contains the sensitive details
            // This is the error which will be sent to the client
            onFinalError: (finalError) => { log.error(finalError.message); }
        }
    }
});
//# sourceMappingURL=apollo_server.js.map
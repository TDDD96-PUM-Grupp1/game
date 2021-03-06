import * as PIXI from 'pixi.js';

/*
  Handles loading of resources
*/
class ResourceServer {
  constructor() {
    this.resourceDir = 'resources';
    this.cache = {};
  }

  /*
    Request a list of resources to be loaded.
    Takes a list of resources to load and returns a promise.
    Resourcelist should have the following format
    (base resource folder can be omitted from path):
    [{name: "name1", path: "path/to/res1"}, {"name2", "path/to/res2"}, .. {"namen", "path/to/resn"}]

    Promise is rejected if loading any resource fails.
    If all resources load correctly the promise is resolved with an
    array of the resources as result.

    The resulting array is formatted as:
    {name1: --, name2: --, ..., namen: --}, where -- are loaded resources
  */
  requestResources(resourceList) {
    let loadNeeded = false;
    const pixiLoader = new PIXI.loaders.Loader();

    const resources = {};

    // Add resources to be loaded to loader
    for (let i = 0; i < resourceList.length; i += 1) {
      const resource = resourceList[i];
      let path;
      if (resource.path[0] !== '/') {
        path = `${this.resourceDir}/${resource.path}`;
      } else {
        path = this.resourceDir + resource.path;
      }

      // Check if already cached
      if (path in this.cache) {
        resources[resource.name] = this.cache[path];
      } else {
        pixiLoader.add(resource.name, path);
        loadNeeded = true;
      }
    }

    if (!loadNeeded) {
      return new Promise(resolve => {
        resolve(resources);
      });
    }

    // Create promise
    const p = new Promise((resolve, reject) => {
      // Perform load
      pixiLoader.load((loader, result) => {
        const resNames = Object.keys(result);
        let errorFree = true;

        let name;
        let resError;
        let resTexture = {};

        for (let i = 0; i < resNames.length && errorFree; i += 1) {
          name = resNames[i];
          resTexture = result[name].texture;
          resError = result[name].error;

          if (resError != null) {
            // Error loading resource
            errorFree = false;
            reject(new Error(`Failed to load resource ${name} from path ${result[name].url}`));
          } else {
            // Loading successful
            resources[name] = resTexture;
            // Cache url Path
            this.cache[result[name].url] = resTexture;
          }
        }

        if (errorFree) {
          resolve(resources);
        }
      });
    });

    return p;
  }
}

export default ResourceServer;

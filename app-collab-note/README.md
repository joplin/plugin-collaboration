# Real-Time Collaboration on a Note: Web App

This Project aims to develop a web app with a collaborative editor for a Joplin note. Yjs is being used for peer-to-peer communication and conflict-resolution. Yjs is a shared editing framework. It exposes Shared Types that can be manipulated like any other data type and they sync automatically. Yjs also provides binding libraries for editors like CodeMirror, Quill, ProseMirror, etc.
## Demo

![Collab Note Demo](/assets/collab-note-demo.gif)

For more info on the project please refer to the post: [real-time collaboration on  note project](https://discourse.joplinapp.org/t/real-time-collaboration-on-a-note-project/17486)

## getting started
Open terminal from the `app-collab-note/` location and follow the below steps.

Firstly, install all the project dependencies:
```
npm install
```

If you want to test it with development version of Joplin Desktop (DataAPI starting port: 27583), this app should be run as:

```
npm start
```
If you want to test it with production release of Joplin Desktop (DataAPI starting port: 41184), this app should be run as:
```
npm run start:prod
```

After successful execution of the above commands you should see the following:
![](/assets/command-promt.png)

## Usage
<mark>Currently this web app can be tested by running it locally and pasting the url in the config screen for the Collab Note Plugin.</mark>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

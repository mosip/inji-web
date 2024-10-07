# Inji Web  Design Decisions.

**Date:** 2024-04-17

## 1. Migration from JS To TS

### Context :
Why TS ?

1. TS gives us more control on data that is passed within the application
2. TypeScript code tends to be more readable compared to JavaScript, primarily due to its static typing feature.
3. Its more developer friendly

### Decision :
We will be moving to TS from JS


## 2. Folder Structure Maintenance for Tests

### Context :
Its better we move all the test files outside the src, so that source is more cleaner with the implementation and mocks are packed separately.

### Decision :
We will be maintaining the same folder structure as src folder under __ tests __ folder to package all the test files together.

## 3. State Management Library

### Context :
Since the application involves intermediary state changes, Its better we decide a state management library to cater our needs.

### Option 1 : Redux

1. Redux is a light weight js library, which is independent on the language / library we are using.
2. Its very easy to use and maintain
3. But Its maintains the global state /context

### Option 2 : XState

1. XState library is very helpful in maintaining /managing the complex states.
2. XState works using finite state machines.
3. plugins / editors are available to create and debug the flows.
4. But Its more dependent on the state machine, and more tied up with the controller / state machine

### Decision
Since INJI Web is a light weight project with small use case, We will go with Redux, and having xstate for INJIWEB will be hard to maintain.

## 4. UI Management Libraries ( TailwindCSS Over Material UI)

### Context :
Since the application involves UI pages and components, Its better we decide a UI management library to cater our needs.

### Option 1 : Material UI
1. Material UI is a JavaScript framework
2. Material UI Provides Pre Constructed JS Components and little customization to match our wireframe.
3. But Material UI has to load the entire Framework to render the Page, which increase the loadup time of the application.
4. Application will be scalable, but not Customisable.

### Option 2 : Tailwind CSS
1. TailwindCSS is a CSS library that applies the styles and downloads only the styles that is required for the application to load.
2. Tailwind css over more customization to cater our needed, its easy to manage and scale.
3. Tailwind css is easy to maintain and very light weight.

### Decision :
We will go with TailwindCSS over Material UI for the following reasons
1. Tailwind CSS is light weight
2. It improves the loadup time, as it Downloads only the styles that are needed.
3. Its provides more customisability, where system integrators can use it to cater their needs and design

## People
Owners: Vijayakumar, S
Reviewers / team:  Vijayakumar S , challa,  Shiva Kumar, Sasikumar Ganesan

# KnockApp
Social Media Group Chat App

## SetUp React Native Environment
Refer to the attached link:
https://reactnative.dev/docs/environment-setup

## Folder structure
This template follows a very simple project structure:

src: This folder is the main container of all the code inside your application.
actions: This folder contains all actions that can be dispatched to redux.
assets: Asset folder to store all images, vectors, etc.
components: Folder to store any common component that you use through your app (such as a generic button)
constants: Folder to store any kind of constant that you have.
routes: Folder to store the navigators.
reducers: This folder should have all your reducers, and expose the combined result using its index.js
store: Folder to put all redux middlewares and the store.
App.js: Main component that starts your whole app.
index.js: Entry point of your application as per React-Native standards.

## Commands to Run App

#To install the basic dependenices used in App

yarn install

#To run App in Ios

yarn ios

#To run App in Android

yarn android

### Running frontend and server locally

Make sure you have the following installed:
- Node.js
- npm
- Python 2.7
- Google Cloud SDK

Navigate to the  `/frontend` folder

Run:
- `npm install`
- `npm run build`
While this is running, changes to the frontend will be automatically bundled

In a separate terminal, navigate to the `/` folder
Run:
- `py -2 -m pip install -r requirements.txt --target=./libs`
- `dev_appserver.py app.yaml`
While this is running, changes to the server will automatically be applied

View at http://localhost:8080


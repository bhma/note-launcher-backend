import express from "express";
import { routes } from "./routes";
import cors from "cors";

const PORT = process.env.PORT || 10110;
const app = express();

// const corsConfig = {
//     origin: '*',
//     optionsSuccessStatus: 200
// };

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.get('/', (req, res)=> {
    console.log('Hello World!');
    res.send();
});

app.listen(PORT, () => {
    console.log('Server listing on ' + PORT);
});
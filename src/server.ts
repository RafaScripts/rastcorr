import express from 'express';
import cors from 'cors';
import axios from 'axios';
import moment from 'moment';

const app = express();
app.use(cors({origin: '*'}));

const codes = [
  'NL422520600BR',
  'NL420285838BR',
]

app.get('/api/rast', async (req, res) => {

  const data: { code: any; status: any; block: string; date: any; }[] = [];



  for (let i = 0; i < codes.length; i++) {
    const response = await axios.post('https://cluster.apigratis.com/api/v1/correios/rastreio', {
      code: codes[i]
    },{
      headers: {
        'Content-Type': 'application/json',
        'SecretKey': '23f1c789-62ab-4650-af53-0612cc667088',
        'PublicToken': '8IAZn7HKq7QJWbh37N3GOOeRVY',
        'DeviceToken': 'ffdd43b6-8da9-4822-b5fe-47b7f52b296f',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BsYXRhZm9ybWEuYXBpYnJhc2lsLmNvbS5ici9hdXRoL2xvZ2luIiwiaWF0IjoxNjc2NDM0ODAzLCJleHAiOjE3MDc5NzA4MDMsIm5iZiI6MTY3NjQzNDgwMywianRpIjoiM0xGSkt3UVVrRkpVODBTdyIsInN1YiI6IjQ1MiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.IGTWpohJfJCr7j7T2x5kzdsFRuV-eTqCrw6dwZDxsko'
      }
    });

    response.data.response.objetos.map((item: any) => {
      data.push({
        code: item.codObjeto,
        status: item.mensagem,
        block: item.bloqueioObjeto ? 'Bloqueado' : 'Não bloqueado',
        date: moment(Date.now()).format('DD/MM/YYYY HH:mm:ss'),
      })
    });

  }

  let htmlMensagem = ``;
  let whtmensagem = ``;

  data.map((item) => {
    htmlMensagem += `<b>Nova Atualização dos Rastreio</b>
   <b>Código: ${item.code}</b> 
   <b>Status:  ${item.status} </b>
   <b>Bloqueio: ${item.block} </b>
   <b>Data: ${item.date} </b>
   <b>-----------------------------------</b>
    `;
    whtmensagem += `Nova Atualização dos Rastreio\nCódigo: ${item.code}\nStatus:  ${item.status}\nBloqueio: ${item.block}\nData: ${item.date}\n-----------------------------------\n`;
  });




  //notify telegram
  await axios.post('https://api.telegram.org/bot5793038418:AAE4888AzBusJx0LHey1Tvq41hJi8SxSNCU/sendMessage?', {
    chat_id: '525614097',
    parse_mode: 'HTML',
    text: htmlMensagem
  });


  await axios.post(`https://api.callmebot.com/whatsapp.php?phone=557791716934&text=${encodeURIComponent(whtmensagem)}&apikey=6513638`);


  return res.json({message: data});
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
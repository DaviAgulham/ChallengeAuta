const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

// Inicializa el SDK de MercadoPago con Access Token
mercadopago.configure({
  access_token: 'APP_USR-2151620563201494-080316-6fb52a0e6ee83830d0de0187744a6086-1928435193',
});


app.post('/create-preference', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
          currency_id: "ARS"
        },
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    if (!mercadopago.preferences || !mercadopago.preferences.create) {
      console.error('MercadoPago preferences.create is not available.');
      return res.status(500).json({ error: 'MercadoPago preferences.create is not available' });
    }

    mercadopago.preferences.create(preference)
      .then((response) => {
        res.json({
          id: response.body.id,
        });
      })
      .catch((error) => {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Failed to create preference' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/update-car-status', async (req, res) => {
  const { id } = req.body;
  try {
    const carRef = firestore.collection('cars').doc(id);
    await carRef.update({ isReserved: true });
    res.status(200).send('Car status updated');
  } catch (error) {
    console.error('Error updating car status:', error);
    res.status(500).send('Internal Server Error');
  }
});

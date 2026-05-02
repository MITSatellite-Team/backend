import { Database } from "bun:sqlite";

const db = new Database("data.db");
db.run(`
  CREATE TABLE IF NOT EXISTS updates (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp         REAL    NOT NULL,
    beacon            TEXT    NOT NULL,

    gpsValid          INTEGER NOT NULL,
    gpsFix            INTEGER NOT NULL,
    latitude          REAL    NOT NULL,
    longitude         REAL    NOT NULL,
    altitude          REAL    NOT NULL,

    temperature0Valid INTEGER NOT NULL,
    temperature0      REAL    NOT NULL,
    temperature1Valid INTEGER NOT NULL,
    temperature1      REAL    NOT NULL,
    temperature2Valid INTEGER NOT NULL,
    temperature2      REAL    NOT NULL,
    temperature3Valid INTEGER NOT NULL,
    temperature3      REAL    NOT NULL,

    baroValid         INTEGER NOT NULL,
    pressure          REAL    NOT NULL,
    humidity          REAL    NOT NULL,

    imuValid          INTEGER NOT NULL,
    ax REAL NOT NULL, ay REAL NOT NULL, az REAL NOT NULL,
    gx REAL NOT NULL, gy REAL NOT NULL, gz REAL NOT NULL,
    mx REAL NOT NULL, my REAL NOT NULL, mz REAL NOT NULL
  )
`);

const insertUpdate = db.prepare(`
  INSERT INTO updates (
    timestamp,
    beacon,
    gpsValid, gpsFix, latitude, longitude, altitude,
    temperature0Valid, temperature0,
    temperature1Valid, temperature1,
    temperature2Valid, temperature2,
    temperature3Valid, temperature3,
    baroValid, pressure, humidity,
    imuValid,
    ax, ay, az,
    gx, gy, gz,
    mx, my, mz
  ) VALUES (
    $timestamp,
    $beacon,
    $gpsValid, $gpsFix, $latitude, $longitude, $altitude,
    $temperature0Valid, $temperature0,
    $temperature1Valid, $temperature1,
    $temperature2Valid, $temperature2,
    $temperature3Valid, $temperature3,
    $baroValid, $pressure, $humidity,
    $imuValid,
    $ax, $ay, $az,
    $gx, $gy, $gz,
    $mx, $my, $mz
  )
`);

const getLatestUpdate = db.prepare(`
  SELECT * FROM updates ORDER BY id DESC LIMIT 1
`);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = Bun.serve({
    port: 8080,
    tls: {
        key: Bun.file("/etc/letsencrypt/live/leonird.liamh.space/privkey.pem"),
        cert: Bun.file("/etc/letsencrypt/live/leonird.liamh.space/fullchain.pem"),
    },
    routes: {
        "/api/status": new Response("OK", { headers: CORS_HEADERS }),
        "/api/update": {
        OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
        GET: () => {
            const row: any = getLatestUpdate.get();

            if (!row) return new Response("No data yet", { status: 404 });

            row.temperature0Valid = row.temperature0Valid === 1
            row.temperature1Valid = row.temperature1Valid === 1
            row.temperature2Valid = row.temperature2Valid === 1
            row.temperature3Valid = row.temperature3Valid === 1
            row.baroValid = row.baroValid === 1
            row.imuValid = row.imuValid === 1
            row.gpsValid = row.gpsValid === 1

            return new Response(JSON.stringify(row), {
                status: 200,
                headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            });
        },
        POST: async req => {
            try { 
                const body: any = await req.json();

                if(typeof body !== 'object') throw new Error('Error decoding')

                const timestamp: any = body.timestamp
                if(!isFinite(timestamp)) throw new Error('Error decoding')

                const beacon: any = body.beacon
                if(!beacon) throw new Error('Error decoding')
                if(typeof beacon !== 'string') throw new Error('Error decoding')

                const gpsValid: any = body.gpsValid
                if(typeof gpsValid !== 'boolean') throw new Error('Error decoding')

                const gpsFix: any = body.gpsFix
                if(!isFinite(gpsFix)) throw new Error('Error decoding')

                const latitude: any = body.latitude
                if(!isFinite(latitude)) throw new Error('Error decoding')

                const longitude: any = body.longitude
                if(!isFinite(longitude)) throw new Error('Error decoding')

                const altitude: any = body.altitude
                if(!isFinite(altitude)) throw new Error('Error decoding')

                const temperature0Valid: any = body.temperature0Valid
                if(typeof temperature0Valid !== 'boolean') throw new Error('Error decoding')

                const temperature0: any = body.temperature0
                if(!isFinite(temperature0)) throw new Error('Error decoding')

                const temperature1Valid: any = body.temperature1Valid
                if(typeof temperature1Valid !== 'boolean') throw new Error('Error decoding')

                const temperature1: any = body.temperature1
                if(!isFinite(temperature1)) throw new Error('Error decoding')

                const temperature2Valid: any = body.temperature2Valid
                if(typeof temperature2Valid !== 'boolean') throw new Error('Error decoding')

                const temperature2: any = body.temperature2
                if(!isFinite(temperature2)) throw new Error('Error decoding')

                const temperature3Valid: any = body.temperature3Valid
                if(typeof temperature3Valid !== 'boolean') throw new Error('Error decoding')

                const temperature3: any = body.temperature3
                if(!isFinite(temperature3)) throw new Error('Error decoding')

                const baroValid: any = body.baroValid
                if(typeof baroValid !== 'boolean') throw new Error('Error decoding')

                const pressure: any = body.pressure
                if(!isFinite(pressure)) throw new Error('Error decoding')

                const humidity: any = body.humidity
                if(!isFinite(humidity)) throw new Error('Error decoding')

                const imuValid: any = body.imuValid
                if(typeof imuValid !== 'boolean') throw new Error('Error decoding')

                const ax: any = body.ax
                if(!isFinite(ax)) throw new Error('Error decoding')
                const ay: any = body.ay
                if(!isFinite(ay)) throw new Error('Error decoding')
                const az: any = body.az
                if(!isFinite(az)) throw new Error('Error decoding')

                const gx: any = body.gx
                if(!isFinite(gx)) throw new Error('Error decoding')
                const gy: any = body.gy
                if(!isFinite(gy)) throw new Error('Error decoding')
                const gz: any = body.gz
                if(!isFinite(gz)) throw new Error('Error decoding')

                const mx: any = body.mx
                if(!isFinite(mx)) throw new Error('Error decoding')
                const my: any = body.my
                if(!isFinite(my)) throw new Error('Error decoding')
                const mz: any = body.mz
                if(!isFinite(mz)) throw new Error('Error decoding')

                insertUpdate.run({
                    $timestamp:         timestamp,
                    $beacon:            beacon,
                    $gpsValid:          gpsValid ? 1 : 0,
                    $gpsFix:            gpsFix,
                    $latitude:          latitude,
                    $longitude:         longitude,
                    $altitude:          altitude,
                    $temperature0Valid: temperature0Valid ? 1 : 0,
                    $temperature0:      temperature0,
                    $temperature1Valid: temperature1Valid ? 1 : 0,
                    $temperature1:      temperature1,
                    $temperature2Valid: temperature2Valid ? 1 : 0,
                    $temperature2:      temperature2,
                    $temperature3Valid: temperature3Valid ? 1 : 0,
                    $temperature3:      temperature3,
                    $baroValid:         baroValid ? 1 : 0,
                    $pressure:          pressure,
                    $humidity:          humidity,
                    $imuValid:          imuValid ? 1 : 0,
                    $ax: ax, $ay: ay, $az: az,
                    $gx: gx, $gy: gy, $gz: gz,
                    $mx: mx, $my: my, $mz: mz,
                });

                // console.log('Saved update!')
                // console.log(body)

                return new Response("Updated!", { status: 201, headers: CORS_HEADERS });
            } catch(error) {
                // console.warn(error)
            }

            return new Response("Error handling update", { status: 500, headers: CORS_HEADERS });
        },
        },
    },

    fetch(req) {
        return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    },
});

console.log(`Server running at ${server.url}`);
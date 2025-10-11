// google-sheets-db.js
class GoogleSheetsDB {
    constructor(sheetId, apiKey) {
        this.sheetId = sheetId;
        this.apiKey = apiKey;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // Read data from sheet
    async readSheet(sheetName, range = 'A:Z') {
        try {
            const fullRange = `${sheetName}!${range}`;
            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${fullRange}?key=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();
            return this.parseSheetData(data.values);
        } catch (error) {
            console.error('Error reading sheet:', error);
            return [];
        }
    }

    // Append data to sheet
    async appendToSheet(sheetName, values) {
        try {
            const range = `${sheetName}!A:Z`;
            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${range}:append?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: [values]
                    })
                }
            );
            
            return await response.json();
        } catch (error) {
            console.error('Error appending to sheet:', error);
            throw error;
        }
    }

    // Update specific row
    async updateRow(sheetName, rowIndex, values) {
        try {
            const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
            const response = await fetch(
                `${this.baseUrl}/${this.sheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        values: [values]
                    })
                }
            );
            
            return await response.json();
        } catch (error) {
            console.error('Error updating row:', error);
            throw error;
        }
    }

    // Parse sheet data into objects
    parseSheetData(rows) {
        if (!rows || rows.length === 0) return [];
        
        const headers = rows[0];
        return rows.slice(1).map((row, index) => {
            const obj = { _rowNumber: index + 2 }; // +2 for header row and 1-based indexing
            headers.forEach((header, colIndex) => {
                obj[header] = row[colIndex] || '';
            });
            return obj;
        });
    }
}
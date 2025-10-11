// google-sheets-db.js
class GoogleSheetsDB {
    constructor(sheetId, apiKey) {
        this.sheetId = sheetId;
        this.apiKey = apiKey;
        this.appsScriptUrl = CONFIG.APPS_SCRIPT_URL;
    }

    // Read data from sheet
    async readSheet(sheetName, range = 'A:Z') {
        try {
            const response = await fetch(
                `${this.appsScriptUrl}?action=read&sheet=${encodeURIComponent(sheetName)}`
            );

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error('Error reading sheet:', error);
            return [];
        }
    }

    // Append data to sheet
    async appendToSheet(sheetName, values) {
        try {
            const response = await fetch(
                `${this.appsScriptUrl}?action=append&sheet=${encodeURIComponent(sheetName)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        row: values
                    })
                }
            );

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            return result;
        } catch (error) {
            console.error('Error appending to sheet:', error);
            throw error;
        }
    }

    // Update specific row
    async updateRow(sheetName, rowIndex, values) {
        try {
            const response = await fetch(
                `${this.appsScriptUrl}?action=update&sheet=${encodeURIComponent(sheetName)}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rowNumber: rowIndex,
                        row: values
                    })
                }
            );

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            return result;
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
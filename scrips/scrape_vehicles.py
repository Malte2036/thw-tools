import requests
from bs4 import BeautifulSoup
import pandas as pd
import re

base_url = 'https://www.thw-duesseldorf.de'
vehicle_list_url = base_url + '/wir-in-duesseldorfortsverband/fahrzeugflotte'

# Define vehicle types
vehicle_types = ['MTW', 'MzKw', 'GKW', 'MLW', 'Kipper', 'Anhänger', 'Sonstige', 'PKW', 'BRmG-RL', 'LBW', 'LKW', 'MLW V']

# Step 1: Get the list of vehicle links
def get_vehicle_links():
    print("Fetching vehicle links...")
    response = requests.get(vehicle_list_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = []
    for a in soup.select('a.internal-link'):
        href = a.get('href')
        if '/aktuelle-fahrzeuge/' in href:
            full_link = base_url + href
            links.append(full_link)
            print(f"Found link: {full_link}")
    print(f"Total vehicle links found: {len(links)}")
    return links

# Function to extract seat count correctly
def parse_seat_count(seat_text):
    try:
        print(f"Parsing seat count from '{seat_text}'")
        # Pattern for seat count in format "1+4"
        match = re.match(r'(\d+)\+(\d+)', seat_text)
        if match:
            # Sum both numbers if found
            seats = int(match.group(1)) + int(match.group(2))
            return str(seats)
        # Return the original text if no "+" is present
        return seat_text
    except Exception as e:
        print(f"Error parsing seat count from '{seat_text}': {e}")
        return 'Unknown'

# Step 2: Extract details from each vehicle page
def get_vehicle_details(link):
    print(f"Scraping details from: {link}")
    response = requests.get(link)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Initialize vehicle details
    details = {
        'name': '',
        'licensePlate': '',
        'vehicleType': '',
        'radioCallName': '',
        'unit': '',
        'seats': '',
        'chassis': '',
        'bodyManufacturer': '',
        'bodyType': '',
        'specialFeatures': '',
        'totalWeight': '',  # Gesamtgewicht
        'payload': '',      # Nutzlast
        'load': '',        # Beladung
        'yearBuilt': ''    # Baujahr
    }

    try:
        table = soup.select_one('.ce-bodytext table')
        if table:
            for row in table.find_all('tr'):
                columns = row.find_all('td')
                # Process columns in pairs
                for i in range(0, len(columns), 2):
                    if i + 1 < len(columns):
                        label = columns[i].get_text(strip=True)
                        value = columns[i + 1].get_text(strip=True)
                        
                        print(f"Label: {label}, Value: {value}")
                        
                        if 'Kennzeichen' in label:
                            details['licensePlate'] = value
                        elif 'Fahrzeugtyp' in label:
                            details['name'] = value
                            details['vehicleType'] = value
                        elif 'Funkrufname' in label:
                            details['radioCallName'] = value
                        elif 'Einheit' in label:
                            details['unit'] = value
                        elif 'Sitzplätze' in label:
                            details['seats'] = parse_seat_count(value)
                        elif 'Fahrgestell' in label:
                            details['chassis'] = value
                        elif 'Hersteller Aufbau' in label:
                            details['bodyManufacturer'] = value
                        elif 'Aufbau' in label:
                            details['bodyType'] = value
                        elif 'Besonderheiten' in label:
                            details['specialFeatures'] = value
                        elif 'Gesamtgewicht' in label:
                            details['totalWeight'] = value
                        elif 'Nutzlast' in label:
                            details['payload'] = value
                        elif 'Beladung' in label:
                            details['load'] = value
                        elif 'Baujahr' in label:
                            details['yearBuilt'] = value

            # Fallback to detecting vehicle type from name
            for vtype in vehicle_types:
                if vtype.lower() in details['name'].lower():
                    details['vehicleType'] = vtype
                    print(f"Detected vehicle type: {vtype} from name")
                    break
            if not details['vehicleType']:
                print(f"No vehicle type found for {details['name']}")
                details['vehicleType'] = 'Sonstige'

    except Exception as e:
        print(f"Error scraping details from {link}: {e}")
    
    print(f"Scraped data: {details}")
    return details

# Step 3: Scrape all vehicles and save to CSV
def scrape_vehicles():
    print("Starting vehicle scraping...")
    links = get_vehicle_links()
    vehicles = []
    for link in links:
        try:
            details = get_vehicle_details(link)
            vehicles.append(details)
            print(f"Scraped: {details['name']}")
        except Exception as e:
            print(f"Error scraping {link}: {e}")
    df = pd.DataFrame(vehicles)
    df.to_csv('thw_vehicles.csv', index=False, encoding='utf-8')
    print("Scraping completed. Data saved to thw_vehicles.csv.")
    printDf(df)
    

def printDf(df):
    print(df)

if __name__ == '__main__':
    scrape_vehicles()
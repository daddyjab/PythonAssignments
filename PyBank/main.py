"""PyBank - Exercise 03 - Python Challenges

Developer: @daddyjab (Jeff Brown)
TODO:
    * Open the input file
    * Read in the contents one row at a time
    *   Use a dictionary of named tuples to store the needed info
    *   Store the Month/Year and the as "mmm-yyyy" format
    *   Store the absolute Profit/Loss for the month
    *   Calculate and store the change in profit (loss) for each entry (vs. previous month)
    * 
    * When the full input has been processed, calculate
    *   Total number of months included in the dataset
    *   Total net amount of Profit(Losses) over the entire period
    *   Average change in Profit(Losses) between months over the entire period
    *   Greatest increase in profits (date and amount) over the entire period
    *   Greatest decrease in profits (date and amount) over the entire period
"""
# Imports
import os
import csv

# Set the path to the CSV file that contains Udemy offerings

csvPath = os.path.join('Resources', 'budget_data.csv')

# Open the data input file
with open(csvPath, newline='', encoding="utf8") as csvFile:

    # Data format:
    #   Header: Date,Profit/Losses
    #   Sample Data: Jan-2010,867884
    #   Mapping: b_date, b_pl

    # Get an Iterator for the file
    csvReader = csv.reader(csvFile, delimiter=',')

    # Grab the header from the CSV file
    b_Header = next(csvReader)

    # Initialize variables needed for calcs
    # Tally count of months and total P/L across all months
    c_months = 0
    tot_pl = 0.0

    # Remember the previous value of P/L for the calc of change and the average change,
    #  and use "None" to detect if it's the first value (where change should be set to 0.0)
    prev_pl = None
    
    # Use lists to store the current max P/L increase and max P/L decrease and associated dates
    #   0 = Date in "Month-Year" format
    #   1 = max P/L increase or decrease (use None to detect if it's first value)
    max_pl_inc = ["", None]
    max_pl_dec = ["", None]

    # Average change in P/L is just the (last P/L chg - first P/L chg ) / (count of months -1)
    first_plchg = None
    last_plchg = None

    # Read through the input file one row at a time
    for b_Row in csvReader:
        # Populate field values for this row
        try:
            b_date = str(b_Row[0])
            b_pl = float(b_Row[1])
        except:
            print("ERROR: Assigning a row of data into local variables: ", end="")
            print(b_Row)

        # Tally one more month
        c_months += 1

        # Accumulate the total P/L
        tot_pl += b_pl

        # Print debug message
        print(f"Date: {b_date}, P/L: {b_pl}: # Months: {c_months}, Total P/L: {tot_pl}")

    # Perform final calculations
    # avg_plchg = (last_plchg-first_plchg)/(c_months-1)
    avg_plchg = 100.0

    # Print out the results
    print("Financial Analysis")
    print("-"*30)
    print(f"Total Months: {c_months}")
    print(f"Total Profit/Loss: ${tot_pl}")
    print(f"Average Change: ${avg_plchg}")
    print(f"Greatest Increase in Profits: {max_pl_inc[0]} {max_pl_inc[1]}")
    print(f"Greatest Decrease in Profits: {max_pl_dec[0]} {max_pl_dec[1]}")


# # ABOVE IS REUSED CODE - DELETE THIS SECTION WHEN DONE
#     # Specify the output file
#     output_file = os.path.join("output.csv")

#     # Write the content of the zip into a CSV file
#     with open(output_file, "w", newline="", encoding="utf8") as outFile:
        
#         # Open the file for writing
#         writer = csv.writer(outFile)

#         # Write a header row to the file
#         writer.writerow(["Title", "Price", "Subscriber Count", "Number of Reviews", "Course Length", "% Subscribers w/ Reviews"])

#         # Write all of the tuples to the file
#         writer.writerows(o_keyInfo)

# # ABOVE IS REUSED CODE - DELETE THIS SECTION WHEN DONE


"""PyBank - Exercise 03 - Python Challenges

Developer: @daddyjab (Jeff Brown)

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
    prev_pl = 0.0
    chg_pl = 0.0
    
    # Use lists to store the current max P/L increase and max P/L decrease and associated dates
    #   0 = Date in "Month-Year" format
    #   1 = max P/L increase or decrease (use None to detect if it's first value)
    #
    # @TODO: Change these lists to dictionaries to make it more readable
    max_pl_inc = {'bd':"", 'bpl': 0.0}
    max_pl_dec = {'bd':"", 'bpl': 0.0}

    # Average change in P/L is just the (last P/L chg - first P/L chg ) / (count of months -1)
    first_pl = 0.0
    last_pl = 0.0

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

        # Do some special actions if this is the first row of data
        if c_months == 1:
            # Do save this first P/L value - we'll need it to calc the avg change later
            first_pl = b_pl

            # Don't try to calculate a P/L change - there's no prev value yet
            # Don't try to store a max P/L increase or decrease - don't have one yet

        else:
            # Ok, we'll get here for 2nd row and beyond

            # This is the 2nd row, so can start calculating P/L changes
            chg_pl = b_pl - prev_pl

            if c_months == 2:
                # Store this P/L change as both the max P/L increase and decrease
                # (since we only have one P/L change so far, it is both!)
                max_pl_inc['bd'] = b_date
                max_pl_inc['bpl'] = chg_pl
                max_pl_dec['bd'] = b_date
                max_pl_dec['bpl'] = chg_pl
            
            else:
                # With at least 2 P/L changes, can start checking for max P/L increases and decreases
                if chg_pl > max_pl_inc['bpl']:
                    max_pl_inc['bd'] = b_date
                    max_pl_inc['bpl'] = chg_pl

                if chg_pl < max_pl_dec['bpl']:
                    max_pl_dec['bd'] = b_date
                    max_pl_dec['bpl'] = chg_pl
    
        # Final things to do before ending this iteration

        # Save this current P/L value as the last P/L value - it will be eventually!
        last_pl = b_pl

        # Store the current PL amount as the "previous" P/L for use in the next iteration
        prev_pl = b_pl

        # Print debug message
        # print(f"DEBUG: Date: {b_date}, P/L: ${b_pl}: # Months: {c_months}, Total P/L: ${tot_pl}, P/L Change: ${chg_pl}")

    # Perform final calculations
    avg_plchg = (last_pl-first_pl)/(c_months-1)

    # Generate the results - and store in a list for now
    r_rpt = []
    r_rpt.append("Financial Analysis")
    r_rpt.append("-"*30)
    r_rpt.append(f"Total Months: {c_months}")
    r_rpt.append(f"Total Profit/Loss: ${tot_pl:.2f}")
    r_rpt.append(f"Average Change: ${avg_plchg:.2f}")
    r_rpt.append(f"Greatest Increase in Profits: ({max_pl_inc['bd']}) ${max_pl_inc['bpl']:.2f}")
    r_rpt.append(f"Greatest Decrease in Profits: ({max_pl_dec['bd']}) ${max_pl_dec['bpl']:.2f}")

    # Print the results to the terminals
    for r in r_rpt: print(r)

    # Now, output the same information to a flat text file
    # Get the path of the output file
    output_file = os.path.join('report.txt')

    # Write the content of the zip into a CSV file
    with open(output_file, "w", newline="", encoding="utf8") as outFile:
        # Write the report content to the file
        # Use the .join to add a \n between each row of output in the report
        outFile.writelines("\n".join(r_rpt))

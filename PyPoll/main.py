"""PyPoll - Exercise 03 - Python Challenges

Developer: @daddyjab (Jeff Brown)

"""

# For this project, tally election results in a list of
#  dictionary items, then calculate the requested statitics
# Assumptions:
#   * All candidates have different names
#   * No voter voted more than one time
#       => Don't have to check for unique Voter IDs
#   * There is no minimum % required for a candidate to win

# Imports
import os
import csv

# Set the path to the CSV file
csvPath = os.path.join('Resources', 'election_data.csv')

# Create a dictionary to hold election results
e_Results = {}

# Open the data input file
with open(csvPath, newline='', encoding="utf8") as csvFile:

    # Data format:
    #   Header: Voter ID,County,Candidate
    #   Sample Data: 12864552,Marsh,Khan
    #   Mapping: e_vid, e_county, e_cand

    # Get an Iterator for the file
    csvReader = csv.reader(csvFile, delimiter=',')

    # Grab the header from the CSV file
    e_Header = next(csvReader)

    # Initialize variables needed for election data (not really necessary...)
    e_County = ""
    e_Cand = ""
    e_VCount = 0
    
    # Read through the input file one row at a time
    for e_Row in csvReader:
        # Populate field values for this row
        try:
            e_VCount = str(e_Row[0])
            e_County = str(e_Row[1])
            e_Cand = str(e_Row[2])
        except:
            print("ERROR: Assigning a row of data into local variables: ", end="")
            print(e_Row)

        # Check to see if this candidate has already gotten a vote
        if e_Cand in e_Results.keys():
            # Yes, candidate is already present in the dictionary
            # Give the candidate another vote
            e_Results[e_Cand] += 1

        else:
            # No, this is the first vote the candidate has received
            # Mark that the candidate has 1 vote
            e_Results[e_Cand] = 1

        # print(f"DEBUG: Candidate {e_Cand}: ({e_Results[e_Cand]})")

    # Find the top vote count
    e_TopVote = max(e_Results.values())

    # Find the key (i.e., the Candidate) who earned the top vote count
    e_Winner = list(e_Results.keys())[list(e_Results.values()).index(e_TopVote)]

    # Find total votes cast
    e_TotVotes = sum(e_Results.values())

    # Generate the results - and store in a list for now
    r_rpt = []
    r_rpt.append("Election Results")
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
 """
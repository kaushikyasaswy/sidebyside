#from nltk import *;
import collections;
import operator;
import sys;

def extract_neighborhoods(cityname, statename):
    file_t = open("myfile.txt", "w");
    file_t.write("HI THERE");
    file_t.close();
    neighborhoods = []
    neighborhood_weights = []
    neighborhood_dict = {}
    with open("address.txt") as r:
         for line in r:
           neighborhoods.append(line);
    index = 0;
    pincode_values = {};
    count_ind = {};
    print 'Neighborhoods are: ';
    print neighborhoods;
    with open("values.txt") as r:
         y = 0;
         for line in r:
             y=0;
             x = line.strip().split('\t');
             y = y + (float(x[0])/float(5.00)*0.50);  #Stars - 50%
             y = y + (float(x[1])*0.15); #Price Range - 15%
             y = y + (float(x[2])*0.15); #Take Out - 15%
             y = y + (float(x[3])*0.15); #Waiter Service - 15%
             y = y + (float(x[4])*0.05); #Ambience - 05%
             if(neighborhoods[index] in neighborhood_dict.keys()):
                  neighborhood_dict[neighborhoods[index]] = neighborhood_dict[neighborhoods[index]] + y;
                  count_ind[neighborhoods[index]] = count_ind[neighborhoods[index]] + 1;
             else:
                  neighborhood_dict[neighborhoods[index]] = y;
                  count_ind[neighborhoods[index]] = 1;
             index = index+1;
    for x in neighborhood_dict.keys():
       y = x.replace("\n"," ");
       neighborhood_dict[y] = neighborhood_dict[x]/count_ind[x];
       del neighborhood_dict[x];
    sorted_neighborhoods = sorted(neighborhood_dict.items(), key=operator.itemgetter(1), reverse=True);
    f = open("neighborhoods.txt","w");
    for item in sorted_neighborhoods:
        f.write(str(item) + '\n');
    f.close();
    return sorted_neighborhoods;
         
if __name__ == "__main__":
   if(len(sys.argv) >= 3):
     sorted_neighborhoods = extract_neighborhoods(sys.argv[0], sys.argv[1]);
     for val in sorted_neighborhoods:
         print val[0];    
     print sorted_neighborhoods;
   else:
     print null;
   #extract_neighborhoods(ar); 

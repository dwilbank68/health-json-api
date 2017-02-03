var mongoose = require("mongoose");

var DaySchema = new mongoose.Schema({                                                                                    
    _creator:               {type: String, required: true},
    date:                   {type: Date, required: true},
    dateString:             {type: String, required: true},
    weight:                 {type: Number, min: 0, max: 2000, default: 0},
    systolic:               {type: Number, min: 0, max: 300, default: 0},
    diastolic:              {type: Number, min: 0, max: 300, default: 0},
    heartrate:              {type: Number, min: 0, max: 300, default: 0},
    breakfast_salt_1:       {type: String, maxLength: 15}, breakfast_salt_2:       {type: String, maxLength: 15},        
    breakfast_salt_3:       {type: String, maxLength: 15}, breakfast_salt_4:       {type: String, maxLength: 15},        
    breakfast_water_1:      {type: String, maxLength: 15}, breakfast_water_2:      {type: String, maxLength: 15},        
    breakfast_water_3:      {type: String, maxLength: 15}, breakfast_water_4:      {type: String, maxLength: 15},        
    lunch_salt_1:           {type: String, maxLength: 15}, lunch_salt_2:           {type: String, maxLength: 15},        
    lunch_salt_3:           {type: String, maxLength: 15}, lunch_salt_4:           {type: String, maxLength: 15},        
    lunch_water_1:          {type: String, maxLength: 15}, lunch_water_2:          {type: String, maxLength: 15},        
    lunch_water_3:          {type: String, maxLength: 15}, lunch_water_4:          {type: String, maxLength: 15},        
    dinner_salt_1:          {type: String, maxLength: 15}, dinner_salt_2:          {type: String, maxLength: 15},        
    dinner_salt_3:          {type: String, maxLength: 15}, dinner_salt_4:          {type: String, maxLength: 15},        
    dinner_water_1:         {type: String, maxLength: 15}, dinner_water_2:         {type: String, maxLength: 15},        
    dinner_water_3:         {type: String, maxLength: 15}, dinner_water_4:         {type: String, maxLength: 15},        
    snack_salt_1:           {type: String, maxLength: 15}, snack_salt_2:           {type: String, maxLength: 15},        
    snack_salt_3:           {type: String, maxLength: 15}, snack_salt_4:           {type: String, maxLength: 15},        
    snack_water_1:          {type: String, maxLength: 15}, snack_water_2:          {type: String, maxLength: 15},        
    snack_water_3:          {type: String, maxLength: 15}, snack_water_4:          {type: String, maxLength: 15},        
    breakfast_salt_amt_1:   {type: Number, min: 0, max: 2000}, breakfast_salt_amt_2:   {type: Number, min: 0, max: 2000},
    breakfast_salt_amt_3:   {type: Number, min: 0, max: 2000}, breakfast_salt_amt_4:   {type: Number, min: 0, max: 2000},
    breakfast_water_amt_1:  {type: Number, min: 0, max: 2000}, breakfast_water_amt_2:  {type: Number, min: 0, max: 2000},
    breakfast_water_amt_3:  {type: Number, min: 0, max: 2000}, breakfast_water_amt_4:  {type: Number, min: 0, max: 2000},
    lunch_salt_amt_1:       {type: Number, min: 0, max: 2000}, lunch_salt_amt_2:       {type: Number, min: 0, max: 2000},
    lunch_salt_amt_3:       {type: Number, min: 0, max: 2000}, lunch_salt_amt_4:       {type: Number, min: 0, max: 2000},
    lunch_water_amt_1:      {type: Number, min: 0, max: 2000}, lunch_water_amt_2:      {type: Number, min: 0, max: 2000},
    lunch_water_amt_3:      {type: Number, min: 0, max: 2000}, lunch_water_amt_4:      {type: Number, min: 0, max: 2000},
    dinner_salt_amt_1:      {type: Number, min: 0, max: 2000}, dinner_salt_amt_2:      {type: Number, min: 0, max: 2000},
    dinner_salt_amt_3:      {type: Number, min: 0, max: 2000}, dinner_salt_amt_4:      {type: Number, min: 0, max: 2000},
    dinner_water_amt_1:     {type: Number, min: 0, max: 2000}, dinner_water_amt_2:     {type: Number, min: 0, max: 2000},
    dinner_water_amt_3:     {type: Number, min: 0, max: 2000}, dinner_water_amt_4:     {type: Number, min: 0, max: 2000},
    snack_salt_amt_1:       {type: Number, min: 0, max: 2000}, snack_salt_amt_2:       {type: Number, min: 0, max: 2000},
    snack_salt_amt_3:       {type: Number, min: 0, max: 2000}, snack_salt_amt_4:       {type: Number, min: 0, max: 2000},
    snack_water_amt_1:      {type: Number, min: 0, max: 2000}, snack_water_amt_2:      {type: Number, min: 0, max: 2000},
    snack_water_amt_3:      {type: Number, min: 0, max: 2000}, snack_water_amt_4:      {type: Number, min: 0, max: 2000},
    saltTotal: Number, waterTotal: Number                                                                                
});                                                                                                                      

var Day = mongoose.model('Day', DaySchema);

module.exports = {Day};
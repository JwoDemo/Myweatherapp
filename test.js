// Weather App Test Suite - Automated tests for weather application functionality
// Last updated: March 30, 2024
// Test cases for the weather application

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper function to log test results
function logTest(message, passed) {
    const result = passed ? 'PASS' : 'FAIL';
    if (isBrowser) {
        console.log(`${message}: ${result}`);
    } else {
        console.log(`\x1b[${passed ? '32' : '31'}m${message}: ${result}\x1b[0m`);
    }
}

// Test Case 1: Valid ZIP code format
function testValidZipCodeFormat() {
    console.log('\nTest Case 1: Valid ZIP code format');
    
    const validZips = ['12345', '54321', '00000', '99999'];
    const invalidZips = ['1234', '123456', 'abcde', '1234a', '1234!'];
    
    validZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        logTest(`Testing valid ZIP ${zip}`, isValid);
    });
    
    invalidZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        logTest(`Testing invalid ZIP ${zip}`, !isValid);
    });
}

// Test Case 2: API Response Handling
async function testAPIResponse() {
    console.log('\nTest Case 2: API Response Handling');
    
    // Test with a valid ZIP code (New York)
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=10001,us&appid=235a790f84c436789bb93aa5f39b24dd&units=imperial`);
        const data = await response.json();
        
        if (response.ok) {
            logTest('Valid ZIP code test', true);
            const hasRequiredFields = data.name && data.main && data.weather && data.wind;
            logTest('Response contains required fields', hasRequiredFields);
        }
    } catch (error) {
        logTest('Valid ZIP code test', false);
        console.error('Error:', error.message);
    }
    
    // Test with an invalid ZIP code
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=00000,us&appid=235a790f84c436789bb93aa5f39b24dd&units=imperial`);
        const data = await response.json();
        
        logTest('Invalid ZIP code test', data.cod === '404');
    } catch (error) {
        logTest('Invalid ZIP code test', false);
        console.error('Error:', error.message);
    }
}

// Test Case 3: Data Sanitization
function testDataSanitization() {
    console.log('\nTest Case 3: Data Sanitization');
    
    const testCases = [
        { input: '<script>alert("xss")</script>', expected: 'scriptalert("xss")/script' },
        { input: 'New York', expected: 'New York' },
        { input: '12345', expected: '12345' }
    ];
    
    testCases.forEach(test => {
        const sanitized = test.input.replace(/[<>]/g, '');
        logTest(`Testing "${test.input}"`, sanitized === test.expected);
    });
}

// Test Case 4: Temperature Conversion
function testTemperatureConversion() {
    console.log('\nTest Case 4: Temperature Conversion');
    
    const testCases = [
        { celsius: 0, expected: 32 },
        { celsius: 100, expected: 212 },
        { celsius: -40, expected: -40 }
    ];
    
    testCases.forEach(test => {
        const fahrenheit = (test.celsius * 9/5) + 32;
        const passed = Math.abs(fahrenheit - test.expected) < 0.1;
        logTest(`Testing ${test.celsius}°C`, passed);
    });
}

// Run all tests
async function runAllTests() {
    console.log('Starting Weather App Tests...\n');
    
    testValidZipCodeFormat();
    await testAPIResponse();
    testDataSanitization();
    testTemperatureConversion();
    
    console.log('\nAll tests completed!');
}

// Run the tests when the file is executed
if (isBrowser) {
    // In browser, run tests immediately
    runAllTests();
} else {
    // In Node.js, export the test function
    module.exports = runAllTests;
} 
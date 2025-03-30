// Test cases for the weather application

// Test Case 1: Valid ZIP code format
function testValidZipCodeFormat() {
    const validZips = ['12345', '54321', '00000', '99999'];
    const invalidZips = ['1234', '123456', 'abcde', '1234a', '1234!'];
    
    console.log('Test Case 1: Valid ZIP code format');
    
    validZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        console.log(`Testing ${zip}: ${isValid ? 'PASS' : 'FAIL'}`);
    });
    
    invalidZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        console.log(`Testing ${zip}: ${!isValid ? 'PASS' : 'FAIL'}`);
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
            console.log('Valid ZIP code test: PASS');
            console.log('Response contains required fields:', 
                data.name && 
                data.main && 
                data.weather && 
                data.wind ? 'PASS' : 'FAIL'
            );
        }
    } catch (error) {
        console.log('Valid ZIP code test: FAIL', error);
    }
    
    // Test with an invalid ZIP code
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=00000,us&appid=235a790f84c436789bb93aa5f39b24dd&units=imperial`);
        const data = await response.json();
        
        if (data.cod === '404') {
            console.log('Invalid ZIP code test: PASS');
        } else {
            console.log('Invalid ZIP code test: FAIL');
        }
    } catch (error) {
        console.log('Invalid ZIP code test: FAIL', error);
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
        console.log(`Testing "${test.input}": ${sanitized === test.expected ? 'PASS' : 'FAIL'}`);
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
        console.log(`Testing ${test.celsius}°C: ${Math.abs(fahrenheit - test.expected) < 0.1 ? 'PASS' : 'FAIL'}`);
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
runAllTests(); 
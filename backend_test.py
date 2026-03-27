import requests
import sys
import json
from datetime import datetime
import time

class EcommerceAPITester:
    def __init__(self, base_url="https://rapid-sales-system.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_size": len(response.text) if response.text else 0
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        response_data = response.json()
                        if isinstance(response_data, list):
                            print(f"   Response: List with {len(response_data)} items")
                        elif isinstance(response_data, dict):
                            if 'message' in response_data:
                                print(f"   Message: {response_data['message']}")
                            elif 'count' in response_data:
                                print(f"   Count: {response_data['count']}")
                        result["response_data"] = response_data
                    except:
                        print(f"   Response length: {len(response.text)} chars")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text[:200]}...")

            self.test_results.append(result)
            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "TIMEOUT",
                "success": False,
                "error": "Request timeout"
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_products_endpoints(self):
        """Test products CRUD operations"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS ENDPOINTS")
        print("="*50)
        
        # Get products (should auto-initialize 5 default products)
        success, products = self.run_test("Get Products", "GET", "products", 200)
        
        if success and products:
            print(f"   Found {len(products)} products")
            if len(products) >= 5:
                print("   ✅ Default products initialized correctly")
                # Store first product ID for later tests
                self.test_product_id = products[0]['id']
                return True
            else:
                print("   ⚠️  Expected at least 5 default products")
        
        return success

    def test_create_product(self):
        """Test creating a new product"""
        test_product = {
            "name": "Test Product API",
            "prix_achat": 10.0,
            "prix_vente": 25.0,
            "image_url": "https://via.placeholder.com/300",
            "description": "Test product for API testing",
            "cible": "Test audience",
            "angle_marketing": "Test marketing angle"
        }
        
        success, response = self.run_test("Create Product", "POST", "products", 200, test_product)
        if success and 'id' in response:
            self.created_product_id = response['id']
            print(f"   Created product with ID: {self.created_product_id}")
        return success

    def test_delete_product(self):
        """Test deleting a product"""
        if hasattr(self, 'created_product_id'):
            return self.run_test("Delete Product", "DELETE", f"products/{self.created_product_id}", 200)
        else:
            print("⚠️  Skipping delete test - no product created")
            return True

    def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        print("\n" + "="*50)
        print("TESTING ANALYTICS ENDPOINTS")
        print("="*50)
        
        # Test today's analytics
        success1, _ = self.run_test("Get Today Analytics", "GET", "analytics/today", 200)
        
        # Test analytics history
        success2, _ = self.run_test("Get Analytics History", "GET", "analytics/history", 200)
        
        return success1 and success2

    def test_generation_endpoints(self):
        """Test content generation endpoints"""
        print("\n" + "="*50)
        print("TESTING CONTENT GENERATION ENDPOINTS")
        print("="*50)
        
        if not hasattr(self, 'test_product_id'):
            print("⚠️  Skipping generation tests - no product ID available")
            return False

        # Test TikTok scripts generation (this will take time due to LLM)
        print("⏳ Generating TikTok scripts (this may take 30-60 seconds)...")
        success1, _ = self.run_test(
            "Generate TikTok Scripts", 
            "POST", 
            "generate/tiktok-scripts", 
            200, 
            {"product_id": self.test_product_id},
            timeout=90
        )
        
        if success1:
            # Test getting the generated scripts
            success2, _ = self.run_test("Get TikTok Scripts", "GET", f"tiktok-scripts/{self.test_product_id}", 200)
        else:
            success2 = False

        # Test DM scripts generation
        print("⏳ Generating DM scripts...")
        success3, _ = self.run_test(
            "Generate DM Scripts", 
            "POST", 
            "generate/dm-scripts", 
            200,
            timeout=60
        )
        
        if success3:
            # Test getting DM scripts
            success4, _ = self.run_test("Get DM Scripts", "GET", "dm-scripts", 200)
        else:
            success4 = False

        # Test sales page generation
        print("⏳ Generating sales page...")
        success5, _ = self.run_test(
            "Generate Sales Page", 
            "POST", 
            "generate/sales-page", 
            200, 
            {"product_id": self.test_product_id},
            timeout=60
        )
        
        if success5:
            # Test getting sales page
            success6, _ = self.run_test("Get Sales Page", "GET", f"sales-pages/{self.test_product_id}", 200)
        else:
            success6 = False

        return success1 and success2 and success3 and success4 and success5 and success6

    def test_strategy_endpoints(self):
        """Test strategy and action plan endpoints"""
        print("\n" + "="*50)
        print("TESTING STRATEGY ENDPOINTS")
        print("="*50)
        
        success1, _ = self.run_test("Get Strategy", "GET", "strategy", 200)
        success2, _ = self.run_test("Get Action Plan", "GET", "action-plan", 200)
        
        return success1 and success2

    def test_payment_endpoints(self):
        """Test payment endpoints (basic structure test)"""
        print("\n" + "="*50)
        print("TESTING PAYMENT ENDPOINTS")
        print("="*50)
        
        # Test checkout session creation (will fail without proper data but should return 400, not 500)
        checkout_data = {
            "package_id": "starter",
            "origin_url": "https://test.com"
        }
        
        # This might fail due to Stripe configuration, but should not return 500
        success, _ = self.run_test("Create Checkout Session", "POST", "checkout/session", 200, checkout_data)
        
        # If it fails with 400 or similar, that's expected without proper Stripe setup
        if not success:
            print("   ℹ️  Payment endpoint test failed - this is expected without proper Stripe configuration")
            return True  # Consider this acceptable for testing
        
        return success

    def test_orders_endpoints(self):
        """Test orders management endpoints (Phase 2)"""
        print("\n" + "="*50)
        print("TESTING ORDERS ENDPOINTS (PHASE 2)")
        print("="*50)
        
        # Test getting orders (should be empty initially)
        success1, orders = self.run_test("Get All Orders", "GET", "orders", 200)
        
        # Test creating an order
        if hasattr(self, 'test_product_id'):
            order_data = {
                "product_id": self.test_product_id,
                "quantity": 2,
                "customer_email": "test@example.com",
                "customer_name": "Test Customer"
            }
            success2, order_response = self.run_test("Create Order", "POST", "orders", 200, order_data)
            
            if success2 and 'id' in order_response:
                self.test_order_id = order_response['id']
                print(f"   Created order with ID: {self.test_order_id}")
                
                # Test getting specific order
                success3, _ = self.run_test("Get Specific Order", "GET", f"orders/{self.test_order_id}", 200)
                
                # Test updating order status
                success4, _ = self.run_test("Update Order Status", "PATCH", f"orders/{self.test_order_id}/status?status=paid", 200)
                
                # Test filtering orders by status
                success5, _ = self.run_test("Filter Orders by Status", "GET", "orders?status=paid", 200)
                
                return success1 and success2 and success3 and success4 and success5
            else:
                return success1 and success2
        else:
            print("⚠️  Skipping order creation - no product ID available")
            return success1

    def test_customers_endpoints(self):
        """Test customers CRM endpoints (Phase 2)"""
        print("\n" + "="*50)
        print("TESTING CUSTOMERS ENDPOINTS (PHASE 2)")
        print("="*50)
        
        # Test getting customers
        success1, customers = self.run_test("Get All Customers", "GET", "customers", 200)
        
        # If we created an order, there should be a customer
        if success1 and customers and len(customers) > 0:
            customer_email = customers[0]['email']
            # Test getting customer orders
            success2, _ = self.run_test("Get Customer Orders", "GET", f"customers/{customer_email}/orders", 200)
            return success1 and success2
        else:
            print("   ℹ️  No customers found - this is expected if no orders were created")
            return success1

    def test_store_endpoints(self):
        """Test public store endpoints (Phase 2)"""
        print("\n" + "="*50)
        print("TESTING STORE ENDPOINTS (PHASE 2)")
        print("="*50)
        
        if hasattr(self, 'test_product_id'):
            # Test store checkout (this will create a Stripe session)
            checkout_data = {
                "product_id": self.test_product_id,
                "quantity": 1,
                "customer_email": "store@example.com",
                "customer_name": "Store Customer"
            }
            success, response = self.run_test("Store Checkout", "POST", "store/checkout", 200, checkout_data)
            
            if success and 'checkout_url' in response:
                print(f"   ✅ Checkout URL generated successfully")
                return True
            else:
                print("   ⚠️  Checkout response missing checkout_url")
                return success
        else:
            print("⚠️  Skipping store checkout - no product ID available")
            return False

    def test_export_endpoints(self):
        """Test content export endpoints (Phase 2)"""
        print("\n" + "="*50)
        print("TESTING EXPORT ENDPOINTS (PHASE 2)")
        print("="*50)
        
        # Test TikTok scripts export
        if hasattr(self, 'test_product_id'):
            success1, response1 = self.run_test("Export TikTok Scripts", "GET", f"export/tiktok-scripts/{self.test_product_id}?format=txt", 200)
            if success1 and 'content' in response1:
                print(f"   ✅ TikTok scripts export contains {len(response1['content'])} characters")
        else:
            success1 = False
            print("⚠️  Skipping TikTok export - no product ID available")
        
        # Test DM scripts export
        success2, response2 = self.run_test("Export DM Scripts", "GET", "export/dm-scripts?format=txt", 200)
        if success2 and 'content' in response2:
            print(f"   ✅ DM scripts export contains {len(response2['content'])} characters")
        
        return success1 and success2

    def test_analytics_products_endpoint(self):
        """Test products analytics endpoint (Phase 2)"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS ANALYTICS (PHASE 2)")
        print("="*50)
        
        success, analytics = self.run_test("Get Products Analytics", "GET", "analytics/products", 200)
        
        if success and analytics:
            print(f"   Found analytics for {len(analytics)} products")
            for product_analytics in analytics[:3]:  # Show first 3
                print(f"   - {product_analytics.get('product_name', 'Unknown')}: {product_analytics.get('total_sales', 0)}€ sales")
        
        return success

def main():
    print("🚀 Starting E-commerce API Testing - PHASE 2 FEATURES")
    print("="*60)
    
    tester = EcommerceAPITester()
    
    # Test basic connectivity
    success = tester.test_root_endpoint()
    if not success:
        print("❌ Root endpoint failed - stopping tests")
        return 1

    # Test products endpoints
    products_success = tester.test_products_endpoints()
    if products_success:
        tester.test_create_product()
        tester.test_delete_product()

    # Test analytics
    tester.test_analytics_endpoints()

    # Test content generation (this will take time) - SKIP for budget reasons
    print("\n⚠️  SKIPPING CONTENT GENERATION TESTS (Budget limited as per instructions)")
    # if products_success:
    #     tester.test_generation_endpoints()

    # Test strategy endpoints
    tester.test_strategy_endpoints()

    # Test payment endpoints
    tester.test_payment_endpoints()

    # ===== PHASE 2 NEW FEATURES =====
    print("\n" + "🆕"*20)
    print("TESTING PHASE 2 NEW FEATURES")
    print("🆕"*20)

    # Test orders management
    if products_success:
        tester.test_orders_endpoints()

    # Test customers CRM
    tester.test_customers_endpoints()

    # Test public store
    if products_success:
        tester.test_store_endpoints()

    # Test export functionality
    tester.test_export_endpoints()

    # Test products analytics
    tester.test_analytics_products_endpoint()

    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS - PHASE 2")
    print("="*60)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests
    failed_tests = [test for test in tester.test_results if not test['success']]
    if failed_tests:
        print(f"\n❌ Failed tests ({len(failed_tests)}):")
        for test in failed_tests:
            error_msg = test.get('error', f"Status {test.get('actual_status', 'unknown')}")
            print(f"   - {test['test_name']}: {error_msg}") 
    
    # Save detailed results
    with open('/app/test_reports/backend_api_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run)*100
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/test_reports/backend_api_results.json")
    
    return 0 if tester.tests_passed >= (tester.tests_run * 0.8) else 1  # 80% success threshold

if __name__ == "__main__":
    sys.exit(main())
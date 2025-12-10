#!/usr/bin/env python3
"""
Script to test the Chrome extension with Playwright
"""
import os
from playwright.sync_api import sync_playwright

def test_extension():
    # Get the absolute path to the extension directory
    extension_path = os.path.abspath('extension')
    print(f"Loading extension from: {extension_path}")
    
    with sync_playwright() as p:
        # Launch browser with extension
        # Note: Extensions only work with persistent context in Chromium
        context = p.chromium.launch_persistent_context(
            user_data_dir='',  # Empty string for temporary directory
            headless=False,  # Extensions don't work in headless mode
            args=[
                f'--disable-extensions-except={extension_path}',
                f'--load-extension={extension_path}',
            ]
        )
        
        page = context.new_page()
        
        # Navigate to LeetCode problem
        print("Navigating to LeetCode problem...")
        page.goto('https://leetcode.com/problems/two-sum/description/')
        
        # Wait for page to load
        page.wait_for_load_state('networkidle')
        
        # Wait a bit for the extension to inject content
        page.wait_for_timeout(3000)
        
        # Take a screenshot
        screenshot_path = 'extension_test_screenshot.png'
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to: {screenshot_path}")
        
        # Check if the pill was injected
        pill_exists = page.evaluate("""
            () => {
                const pill = document.querySelector('.leet-helper-pill');
                return {
                    exists: !!pill,
                    text: pill ? pill.textContent : null,
                    visible: pill ? pill.offsetParent !== null : false
                };
            }
        """)
        
        print(f"Pill injection status: {pill_exists}")
        
        # Keep browser open for manual inspection
        print("\nBrowser is open for manual inspection.")
        print("You can:")
        print("  - Check if the 'Explainer' pill appears next to the Leet tab")
        print("  - Click the pill to test the canvas functionality")
        print("  - Toggle LeetCode's theme to test light/dark mode")
        print("  - Open DevTools to check console logs")
        print("\nPress Ctrl+C to close the browser and exit...")

        try:
            # Wait indefinitely until user interrupts
            while True:
                import time
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nClosing browser...")
        finally:
            context.close()

if __name__ == '__main__':
    test_extension()


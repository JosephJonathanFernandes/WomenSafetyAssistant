package handlers

import (
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/gofiber/fiber/v2"
)

// WolframProxy proxies requests to Wolfram|Alpha JSON API
func WolframProxy(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "missing q"})
	}
	appid := os.Getenv("WOLFRAM_APP_ID")
	if appid == "" {
		// Fallback to provided key if env not set (dev-only convenience)
		appid = "3QX287W2VP"
	}

	params := url.Values{}
	params.Add("appid", appid)
	params.Add("input", query)
	params.Add("output", "json")

	endpoint := "https://api.wolframalpha.com/v2/query?" + params.Encode()
	resp, err := http.Get(endpoint)
	if err != nil {
		return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": err.Error()})
	}
	defer resp.Body.Close()

	body, readErr := io.ReadAll(resp.Body)
	if readErr != nil {
		return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": readErr.Error()})
	}
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/json"
	}
	c.Set("Content-Type", contentType)
	return c.Status(resp.StatusCode).Send(body)
}

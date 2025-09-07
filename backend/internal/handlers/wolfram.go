package handlers

import (
	"net/http"
	"net/url"
	"women-safety-backend/config"

	"github.com/gofiber/fiber/v2"
)

// Proxy to Wolfram|Alpha API to avoid CORS and hide the AppID from the browser
func WolframProxy(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "missing q"})
	}
	appid := config.WolframAppID
	if appid == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "missing WOLFRAM_APP_ID on server"})
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

	c.Set("Content-Type", "application/json")
	c.Status(resp.StatusCode)
	return c.SendStream(resp.Body)
}
